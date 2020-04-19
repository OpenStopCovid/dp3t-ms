#!/usr/bin/env node
require('dotenv').config()

const {join} = require('path')
const {json} = require('micro')
const Redis = require('ioredis')
const ms = require('ms')
const uuid = require('uuid')
const randomNumber = require('random-number-csprng')
const {readYamlSync} = require('../../lib/util/yaml')
const {forbidden, methodNotAllowed, notFound} = require('../../lib/util/http')
const {handleErrors, injectRedis} = require('../../lib/util/middlewares')

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

function getCodeStorageKey(type, code) {
  return `${type === 'pincode' ? 'pin' : 'qr'}:${code}`
}

async function generatePinCode() {
  return (await randomNumber(0, 999999999)).toString().padStart('0')
}

async function generateQRCode() {
  return uuid.v4()
}

async function createPinCode(redis, ttl, extras) {
  const code = await generatePinCode()
  const result = await redis.set(getCodeStorageKey('pincode', code), {extras}, 'EX', ttl, 'NX')
  return result === 'OK' ? code : createPinCode(ttl, extras)
}

async function createQRCode(redis, ttl, extras) {
  const code = await generateQRCode()
  await redis.set(getCodeStorageKey('qrcode', code), {extras}, 'EX', ttl, 'NX')
  return code
}

function getExpireAt(ttl) {
  return new Date(Date.now() + (ttl * 1000))
}

async function createCode(req) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {type, emitter} = body
  const definition = codesDefinitions.find(d => d.type === type && d.emitter === emitter)

  if (!definition) {
    return forbidden('Unknown emitter/type couple')
  }

  const extras = body.extras || {}
  const {ttl} = definition

  let code

  if (type === 'qrcode') {
    code = await createQRCode(req.redis, ttl, extras)
  } else if (type === 'pincode') {
    code = await createPinCode(req.redis, ttl, extras)
  }

  return {type, code, expireAt: getExpireAt(ttl), ttl}
}

async function getCodeStatus(req) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {type, code} = body

  const ttl = await req.redis.ttl(getCodeStorageKey(type, code))

  return {type, code, isActive: ttl > 0}
}

async function useCode(req) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {type, code} = body

  const key = getCodeStorageKey(type, code)

  const result = await req.redis.multi()
    .get(key)
    .del(key)
    .exec()

  if (!result[0][1]) {
    return forbidden('Code does not exist or has expired')
  }

  return {extras: result[0][1].extras || {}}
}

function handler(req, res) {
  if (req.url === '/create-code') {
    return createCode(req, res)
  }

  if (req.url === '/get-code-status') {
    return getCodeStatus(req, res)
  }

  if (req.url === '/use-code') {
    return useCode(req, res)
  }

  notFound()
}

module.exports = injectRedis(
  handleErrors(handler),
  new Redis(process.env.REDIS_URL, {keyPrefix: 'codes:'})
)
