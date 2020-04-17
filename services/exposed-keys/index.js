#!/usr/bin/env node
require('dotenv').config()

const {json, send} = require('micro')
const {isValid, formatISO} = require('date-fns')
const Redis = require('ioredis')

const {methodNotAllowed, badRequest} = require('../../lib/util/http')

const redis = new Redis(process.env.REDIS_URL, {keyPrefix: 'keys:'})

function getCurrentDate() {
  return formatISO(new Date(), {representation: 'date'})
}

async function declareExposedKey(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res)
  }

  const body = await json(req)
  const {key, onset} = body

  if (!key) {
    return badRequest(res, 'key is a required param')
  }

  if (!onset || !isValid(new Date(onset))) {
    return badRequest(res, 'onset is a required and must be a valid date')
  }

  const currentDate = getCurrentDate()
  const structuredKey = `${onset}|${key}`

  await redis.sadd(currentDate, structuredKey)

  return send(res, 204)
}

async function getExposedKeys(req, res) {
  if (req.method !== 'GET') {
    return methodNotAllowed(res)
  }

  const dayDate = req.url.slice(9, 19)

  if (!isValid(new Date(dayDate))) {
    return badRequest(res, 'Invalid date requested')
  }

  const structuredKeys = await redis.smembers(dayDate)

  return {
    exposed: structuredKeys.map(skey => ({
      onset: skey.slice(0, 10),
      key: skey.slice(11)
    }))
  }
}

module.exports = (req, res) => {
  if (req.url === '/exposed') {
    return declareExposedKey(req, res)
  }

  if (req.url.startsWith('/exposed/20')) {
    return getExposedKeys(req, res)
  }

  return send(res, 404)
}
