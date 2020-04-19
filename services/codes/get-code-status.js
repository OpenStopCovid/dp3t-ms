const {json} = require('micro')
const {methodNotAllowed} = require('../../lib/util/http')
const {getCodeStorageKey} = require('./util')

async function getCodeStatus(req) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {type, code} = body

  const ttl = await req.redis.ttl(getCodeStorageKey(type, code))

  return {type, code, isActive: ttl > 0}
}

module.exports = {getCodeStatus}
