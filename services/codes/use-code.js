const {json} = require('micro')
const {forbidden, methodNotAllowed} = require('../../lib/util/http')
const {getCodeStorageKey} = require('./util')

async function useCode(req) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {type, code} = body

  const key = getCodeStorageKey(type, code)

  const result = await req.redis.multi()
    .get(key)
    .del(key)
    .exec()

  if (!result[0][1]) {
    return forbidden('Code does not exist or has expired')
  }

  return {extras: result[0][1].extras || {}}
}

module.exports = {useCode}
