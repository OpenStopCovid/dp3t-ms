const {isValid} = require('date-fns')
const {methodNotAllowed, badRequest} = require('../../lib/util/http')

async function getExposedKeys(req) {
  if (req.method !== 'GET') {
    return methodNotAllowed()
  }

  const dayDate = req.url.slice(9, 19)

  if (!isValid(new Date(dayDate))) {
    return badRequest('Invalid date requested')
  }

  const structuredKeys = await req.redis.smembers(dayDate)

  return {
    exposed: structuredKeys.map(skey => ({
      onset: skey.slice(0, 10),
      key: skey.slice(11)
    }))
  }
}

module.exports = {getExposedKeys}
