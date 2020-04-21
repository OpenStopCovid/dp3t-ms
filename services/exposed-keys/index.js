#!/usr/bin/env node
require('dotenv').config()

const {createRedis} = require('../../lib/util/redis')
const {notFound} = require('../../lib/util/http')
const {handleErrors, injectRedis} = require('../../lib/util/middlewares')

const {getExposedKeys} = require('./get-exposed-keys')
const {declareExposedKey} = require('./declare-exposed-key')

function handler(req, res) {
  if (req.url === '/exposed') {
    return declareExposedKey(req, res)
  }

  if (req.url.startsWith('/exposed/20')) {
    return getExposedKeys(req, res)
  }

  notFound()
}

module.exports = injectRedis(
  handleErrors(handler),
  createRedis(process.env.REDIS_URL, {keyPrefix: 'keys:'})
)
