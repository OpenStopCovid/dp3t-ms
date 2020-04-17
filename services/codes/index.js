#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const {json, send} = require('micro')
const Redis = require('ioredis')
const ms = require('ms')
const uuid = require('uuid')
const randomNumber = require('random-number-csprng')
const {readYamlSync} = require('../../lib/util/yaml')

const redis = new Redis(process.env.REDIS_URL, {keyPrefix: 'codes:'})

function getCodesDefinitions() {
  const definitions = readYamlSync(join(process.cwd(), 'config', 'codes.yaml'))
  definitions.forEach(d => {
    if (!['pincode', 'qrcode'].includes(d.type)) {
      throw new Error(`Unknown code type in codes definition file: ${d.type}`)
    }

    d.ttl = ms(d.ttl) / 1000
  })
  return definitions
}

const codesDefinitions = getCodesDefinitions()

async function generatePinCode() {
  return (await randomNumber(0, 999999999)).toString().padStart('0')
}

async function generateQRCode() {
  return uuid.v4()
}

async function createPinCode(ttl, extras) {
  const code = await generatePinCode()
  const result = await redis.set(`pin:${code}`, {extras}, 'EX', ttl, 'NX')
  return result === 'OK' ? code : createPinCode(ttl, extras)
}

async function createQRCode(ttl, extras) {
  const code = await generateQRCode()
  await redis.set(`qr:${code}`, {extras}, 'EX', ttl, 'NX')
  return code
}

function getExpireAt(ttl) {
  return new Date(Date.now() + (ttl * 1000))
}

function methodNotAllowed(res) {
  return send(res, 405)
}

function forbidden(res, message) {
  return send(res, 403, {
    code: 403,
    message
  })
}

async function createCode(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed(res)
  }

  const body = await json(req)
  const {type, emitter, extras} = body
  const definition = codesDefinitions.find(d => d.type === type && d.emitter === emitter)

  if (!definition) {
    return forbidden(res)
  }

  const {ttl} = definition

  let code

  if (type === 'qrcode') {
    code = await createQRCode(ttl, extras)
  } else if (type === 'pincode') {
    code = await createPinCode(ttl, extras)
  }

  return {code, expireAt: getExpireAt(ttl)}
}

module.exports = (req, res) => {
  if (req.url === '/create-code') {
    return createCode(req, res)
  }

  return send(res, 404)
}
