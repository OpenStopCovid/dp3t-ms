/* eslint no-await-in-loop: off */
const test = require('ava')
const request = require('supertest')
const micro = require('micro')
const {createRedis} = require('../../../lib/util/redis')
const {handleErrors, injectRedis} = require('../../../lib/util/middlewares')
const {createCode, generatePinCode, generateQRCode} = require('../create-code')

require('dotenv').config()
const redis = createRedis(process.env.REDIS_URL)

function createService() {
  return micro(injectRedis(handleErrors(createCode), redis))
}

test('method not allowed', async t => {
  await request(createService()).get('/')
    .expect(405)

  t.pass()
})

test('valid creation - doctor/qr', async t => {
  const {body} = await request(createService()).post('/')
    .send({
      emitter: 'doctor',
      type: 'qrcode'
    })
    .expect(200)

  t.is(Object.keys(body).length, 4)

  t.is(body.type, 'qrcode')
  t.is(body.code.length, 36)
  const expireAt = new Date(body.expireAt)
  t.is(Math.round((expireAt - Date.now()) / 1000), 3600)
  t.is(body.ttl, 3600)
})

test('valid creation - doctor/pin', async t => {
  const {body} = await request(createService()).post('/')
    .send({
      emitter: 'doctor',
      type: 'pincode'
    })
    .expect(200)

  t.is(Object.keys(body).length, 4)

  t.is(body.type, 'pincode')
  t.is(body.code.length, 9)
  const expireAt = new Date(body.expireAt)
  t.is(Math.round((expireAt - Date.now()) / 1000), 120)
  t.is(body.ttl, 120)
})

test('not valid - unknown/pin', async t => {
  await request(createService()).post('/')
    .send({
      emitter: 'unknown',
      type: 'pincode'
    })
    .expect(403, {code: 403, message: 'Unknown emitter/type couple'})

  t.pass()
})

test('generatePinCode()', async t => {
  t.plan(1000)

  for (let i = 0; i < 1000; i++) {
    const pinCode = await generatePinCode()
    t.regex(pinCode, /^\d{9}$/)
  }
})

test('generateQRCode()', async t => {
  const qrCode = await generateQRCode()
  t.is(qrCode.length, 36)
})
