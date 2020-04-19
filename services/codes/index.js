#!/usr/bin/env node
require('dotenv').config()
const Redis = require('ioredis')
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
  new Redis(process.env.REDIS_URL, {keyPrefix: 'codes:'})
)
