const test = require('ava')
const {createRedis} = require('../redis')
require('dotenv').config()

test('createRedis', t => {
  createRedis(process.env.REDIS_URL)
  t.pass()
})
