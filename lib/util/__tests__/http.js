const test = require('ava')
const request = require('supertest')
const micro = require('micro')
const {methodNotAllowed, forbidden, badRequest, notFound, noContent} = require('../http')
const {handleErrors} = require('../middlewares')

test('methodNotAllowed - no message', async t => {
  const server = micro(handleErrors(() => {
    methodNotAllowed()
  }))

  await request(server).get('/')
    .expect(405, {code: 405, message: 'Method not allowed'})

  t.pass()
})

test('methodNotAllowed - message', async t => {
  const server = micro(handleErrors(() => {
    methodNotAllowed('Foo')
  }))

  await request(server).get('/')
    .expect(405, {code: 405, message: 'Foo'})

  t.pass()
})

test('forbidden - no message', async t => {
  const server = micro(handleErrors(() => {
    forbidden()
  }))

  await request(server).get('/')
    .expect(403, {code: 403, message: 'Forbidden'})

  t.pass()
})

test('forbidden - message', async t => {
  const server = micro(handleErrors(() => {
    forbidden('Foo')
  }))

  await request(server).get('/')
    .expect(403, {code: 403, message: 'Foo'})

  t.pass()
})

test('badRequest - no message', async t => {
  const server = micro(handleErrors(() => {
    badRequest()
  }))

  await request(server).get('/')
    .expect(400, {code: 400, message: 'Bad request'})

  t.pass()
})

test('badRequest - message', async t => {
  const server = micro(handleErrors(() => {
    badRequest('Foo')
  }))

  await request(server).get('/')
    .expect(400, {code: 400, message: 'Foo'})

  t.pass()
})

test('notFound - no message', async t => {
  const server = micro(handleErrors(() => {
    notFound()
  }))

  await request(server).get('/')
    .expect(404, {code: 404, message: 'Not found'})

  t.pass()
})

test('notFound - message', async t => {
  const server = micro(handleErrors(() => {
    notFound('Foo')
  }))

  await request(server).get('/')
    .expect(404, {code: 404, message: 'Foo'})

  t.pass()
})

test('noContent', async t => {
  const server = micro(handleErrors((req, res) => {
    noContent(res)
  }))

  await request(server).get('/')
    .expect(204)

  t.pass()
})
