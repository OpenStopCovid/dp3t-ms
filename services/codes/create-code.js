const {join} = require('path')

const {json} = require('micro')
const ms = require('ms')
const uuid = require('uuid')
const randomNumber = require('random-number-csprng')

const {forbidden, methodNotAllowed} = require('../../lib/util/http')
const {readYamlSync} = require('../../lib/util/yaml')

const {getCodeStorageKey, getExpireAt} = require('./util')

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
  return (await randomNumber(0, 999999999)).toString().padStart(9, '0')
}

async function generateQRCode() {
  return uuid.v4()
}

async function createPinCode(redis, ttl, extras) {
  const code = await generatePinCode()
  const result = await redis.set(getCodeStorageKey('pincode', code), {extras}, 'EX', ttl, 'NX')
  return result === 'OK' ? code : createPinCode(redis, ttl, extras)
}

async function createQRCode(redis, ttl, extras) {
  const code = await generateQRCode()
  await redis.set(getCodeStorageKey('qrcode', code), {extras}, 'EX', ttl, 'NX')
  return code
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

module.exports = {
  generatePinCode,
  createCode,
  createPinCode,
  createQRCode,
  generateQRCode,
  getCodesDefinitions
}
