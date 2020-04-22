const test = require('ava')
const request = require('supertest')
const micro = require('micro')
const {createError} = require('micro')
const {handleErrors, injectRedis} = require('../middlewares')

test('injectRedis()', async t => {
  const handle = injectRedis(() => {}, 'redis')
  const req = {}
  const res = {}
  await handle(req, res)
  t.is(req.redis, 'redis')
})

test('handleErrors() - no error', async t => {
  const server = micro(handleErrors(() => {
    return {foo: 'bar'}
  }))

  await request(server).get('/')
    .expect(200, {foo: 'bar'})

  t.pass()
})

test('handleErrors() - error with status code', async t => {
  const server = micro(handleErrors(() => {
    throw createError(403, 'Forbidden')
  }))

  await request(server).get('/')
    .expect(403, {code: 403, message: 'Forbidden'})

  t.pass()
})

test('handleErrors() - other error', async t => {
  const server = micro(handleErrors(() => {
    throw new Error('It is unexpected!!')
  }))

  await request(server).get('/')
    .expect(500, {code: 500, message: 'An unexpected error has occurred'})

  t.pass()
})
