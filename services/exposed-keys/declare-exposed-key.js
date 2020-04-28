const {json} = require('micro')
const {isValid, formatISO} = require('date-fns')
const got = require('got')

const {methodNotAllowed, forbidden, badRequest, noContent} = require('../../lib/util/http')

const CODES_API_URL = process.env.CODES_API_URL || (_ => {
  console.error('env.CODES_API_URL not_defined. Aborting.')
  process.abort()
})()

function getCurrentDate() {
  return formatISO(new Date(), {representation: 'date'})
}

async function useCode(type, code) {
  const gotOptions = {json: {type, code}, responseType: 'json'}

  try {
    const response = await got.post(CODES_API_URL + '/use-code', gotOptions)
    return response.body
  } catch (error) {
    if (error.response && error.response.statusCode && error.response.statusCode === 403) {
      forbidden('Not valid authData')
    }

    throw new Error('Unable to use the given code')
  }
}

async function declareExposedKey(req, res) {
  if (req.method !== 'POST') {
    return methodNotAllowed()
  }

  const body = await json(req)
  const {key, onset, authData} = body

  if (!key) {
    return badRequest('key is a required param')
  }

  if (!onset || !isValid(new Date(onset))) {
    return badRequest('onset is required and must be a valid date')
  }

  if (!authData || !authData.type || !authData.code) {
    return badRequest('authData is required and must contains type and code fields')
  }

  const {type, code} = authData

  await useCode(type, code)

  const currentDate = getCurrentDate()
  const structuredKey = `${onset}|${key}`

  await req.redis.sadd(currentDate, structuredKey)

  noContent(res)
}

module.exports = {
  declareExposedKey
}
