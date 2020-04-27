const test = require('ava')
const {createRedis} = require('../redis')

test('createRedis', t => {
  createRedis('redis://localhost:12345')
  t.pass()
})
