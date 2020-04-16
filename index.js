#!/usr/bin/env node
require('dotenv').config()

const {json, send} = require('micro')

const keysIndex = new Map()

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

  contactKeys.forEach(contactKey => {
    if (!keysIndex.has(contactKey)) {
      keysIndex.set(contactKey, {addedAt: new Date()})
    }
  })

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

  const matchedKeys = personalKeys.filter(personalKey => {
    return keysIndex.has(personalKey)
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
