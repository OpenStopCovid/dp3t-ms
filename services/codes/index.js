#!/usr/bin/env node
require('dotenv').config()

const {createRedis} = require('../../lib/util/redis')
const {notFound} = require('../../lib/util/http')
const {handleErrors, injectRedis} = require('../../lib/util/middlewares')

const {createCode} = require('./create-code')
const {getCodeStatus} = require('./get-code-status')
const {useCode} = require('./use-code')

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
  createRedis(process.env.REDIS_URL, {keyPrefix: 'codes:'})
)
