#!/usr/bin/env node
require('dotenv').config()

const {json, send, createError} = require('micro')
const {isValid, formatISO} = require('date-fns')
const Redis = require('ioredis')
const got = require('got')

const {methodNotAllowed, badRequest, handleErrors} = require('../../lib/util/http')

const CODES_API_URL = process.env.CODES_API_URL || 'http://localhost:5002'

const redis = new Redis(process.env.REDIS_URL, {keyPrefix: 'keys:'})

function getCurrentDate() {
  return formatISO(new Date(), {representation: 'date'})
}

async function useCode(type, code) {
  const gotOptions = {json: {type, code}, responseType: 'json'}

  try {
    const response = await got.post(CODES_API_URL + '/use-code', gotOptions)
    return response.body
  } catch (error) {
    if (error.response && error.response.statusCode && error.response.statusCode === 403) {
      throw createError(403, 'Not valid authData')
    }

    throw createError(500, 'An unexpected error has occurred')
  }
}

async function declareExposedKey(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {key, onset, authData} = body

  if (!key) {
    return badRequest('key is a required param')
  }

  if (!onset || !isValid(new Date(onset))) {
    return badRequest('onset is required and must be a valid date')
  }

  if (!authData || !authData.type || !authData.code) {
    return badRequest('authData is required and must contains type and code fields')
  }

  const {type, code} = authData

  await useCode(type, code)

  const currentDate = getCurrentDate()
  const structuredKey = `${onset}|${key}`

  await redis.sadd(currentDate, structuredKey)

  return send(res, 204)
}

async function getExposedKeys(req) {
  if (req.method !== 'GET') {
    return methodNotAllowed()
  }

  const dayDate = req.url.slice(9, 19)

  if (!isValid(new Date(dayDate))) {
    return badRequest('Invalid date requested')
  }

  const structuredKeys = await redis.smembers(dayDate)

  return {
    exposed: structuredKeys.map(skey => ({
      onset: skey.slice(0, 10),
      key: skey.slice(11)
    }))
  }
}

module.exports = handleErrors((req, res) => {
  if (req.url === '/exposed') {
    return declareExposedKey(req, res)
  }

  if (req.url.startsWith('/exposed/20')) {
    return getExposedKeys(req, res)
  }

  return send(res, 404)
})
