const test = require('ava')
const request = require('supertest')
const micro = require('micro')
const nock = require('nock')
const service = require('..')

const CODES_API_URL = process.env.CODES_API_URL || 'http://localhost:5002'

let server

test.serial('start exposed keys service', async t => {
  server = micro(service)
  t.pass()
})

test.serial('declare exposed keys', async t => {
  // Mock code service
  nock(CODES_API_URL)
  .post('/use-code')
  .reply(200, {})

  const response = await request(server).post('/exposed')
  .send({
    key: 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=',
    onset: '2020-04-10',
    authData: {
      type: 'qrcode',
      code: 'fb604540-9f1f-4c9b-b51b-6b69bbd4ed62'
    }
  })
  .set('Accept', 'application/json')
  .expect(204)
  t.pass()
})

test.serial('get exposed keys for date', async t => {
  const response = await request(server)
  .get('/exposed/2020-04-10')
  .expect(200, [{
    key: 'QUJDREVGR0hJSktMTU5PUFFSU1RVVldYWVpBQkNERUY=',
    onset: '2020-04-10'
  }])
  t.pass()
})

test.serial('stop exposed keys service', async t => {
  await server.close()
  t.pass()
})
