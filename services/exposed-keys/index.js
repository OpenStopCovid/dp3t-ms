#!/usr/bin/env node
require('dotenv').config()

const {json, send} = require('micro')
const Redis = require('ioredis')

const redis = new Redis(process.env.REDIS_URL)

function methodNotAllowed(req, res) {
  return send(res, 405)
}

async function declareCase(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(req, res)
  }

  const body = await json(req)
  const {contactKeys} = body

  if (!contactKeys || !Array.isArray(contactKeys)) {
    return send(res, 400, {
      code: 400,
      message: 'contactKeys is required and must be an array'
    })
  }

  console.log(`Declared case: ${contactKeys.length} contact keys`)

  await redis
    .multi(contactKeys.map(contactKey => {
      return ['set', contactKey, {addedAt: new Date()}]
    }))
    .exec()

  return send(res, 204)
}

async function checkStatus(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(req, res)
  }

  const body = await json(req)
  const {personalKeys} = body

  if (!personalKeys || !Array.isArray(personalKeys)) {
    return send(res, 400, {
      code: 400,
      message: 'personalKeys is required and must be an array'
    })
  }

  const matches = await redis
    .multi(personalKeys.map(personalKey => {
      return ['get', personalKey]
    }))
    .exec()

  const matchedKeys = personalKeys.filter((personalKey, i) => {
    return matches[i][1]
  })

  if (matchedKeys.length > 0) {
    return {
      status: 'positive',
      matchedKeys
    }
  }

  return {
    status: 'negative'
  }
}

module.exports = (req, res) => {
  if (req.url === '/declare-case') {
    return declareCase(req, res)
  }

  if (req.url === '/check-status') {
    return checkStatus(req, res)
  }

  return send(res, 404)
}
