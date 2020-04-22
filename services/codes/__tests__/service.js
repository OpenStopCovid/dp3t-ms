const test = require('ava')
const request = require('supertest')
const micro = require('micro')
const {formatISO} = require('date-fns')
const nock = require('nock')
const service = require('..')

let server, qrcode, pin

test.serial('start codes service', async t => {
  server = micro(service)
  t.pass()
})

test.serial('create qrcode', async t => {
  const response = await request(server).post('/create-code')
  .send({
    emitter: 'doctor',
    type: 'qrcode',
    extras: { extra: 'xxx' }
  })
  .set('Accept', 'application/json')
  .expect(200)
  const { type, code, ttl, expireAt } = response.body
  t.is(type, 'qrcode')
  t.truthy(code)
  t.truthy(ttl)
  t.truthy(expireAt)
  qrcode = code
  t.pass()
})

test.serial('get qrcode status', async t => {
  const response = await request(server).post('/get-code-status')
  .send({
    code: qrcode,
    type: 'qrcode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    code: qrcode,
    type: 'qrcode',
    isActive: true
  })
  t.pass()
})

test.serial('use qrcode', async t => {
  const response = await request(server).post('/use-code')
  .send({
    code: qrcode,
    type: 'qrcode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    extras: { extra: 'xxx' }
  })
  t.pass()
})

test.serial('get used qrcode status', async t => {
  const response = await request(server).post('/get-code-status')
  .send({
    code: qrcode,
    type: 'qrcode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    code: qrcode,
    type: 'qrcode',
    isActive: false
  })
  t.pass()
})

test.serial('create pincode', async t => {
  const response = await request(server).post('/create-code')
  .send({
    emitter: 'doctor',
    type: 'pincode',
    extras: { extra: 'xxx' }
  })
  .set('Accept', 'application/json')
  .expect(200)
  const { type, code, ttl, expireAt } = response.body
  t.is(type, 'pincode')
  t.truthy(code)
  t.truthy(ttl)
  t.truthy(expireAt)
  pincode = code
  t.pass()
})

test.serial('get pincode status', async t => {
  const response = await request(server).post('/get-code-status')
  .send({
    code: pincode,
    type: 'pincode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    code: pincode,
    type: 'pincode',
    isActive: true
  })
  t.pass()
})

test.serial('use pincode', async t => {
  const response = await request(server).post('/use-code')
  .send({
    code: pincode,
    type: 'pincode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    extras: { extra: 'xxx' }
  })
  t.pass()
})

test.serial('get used pincode status', async t => {
  const response = await request(server).post('/get-code-status')
  .send({
    code: pincode,
    type: 'pincode'
  })
  .set('Accept', 'application/json')
  .expect(200, {
    code: pincode,
    type: 'pincode',
    isActive: false
  })
  t.pass()
})

test.serial('stop codes service', async t => {
  await server.close()
  t.pass()
})
