const {send} = require('micro')

function handleErrors(fn) {
  return async (req, res) => {
    try {
      return await fn(req, res)
    } catch (error) {
      if (error.statusCode) {
        return send(res, error.statusCode, {
          code: error.statusCode,
          message: error.message
        })
      }

      if (process.env.NODE_ENV !== 'test') {
        console.error(error)
      }

      send(res, 500, {code: 500, message: 'An unexpected error has occurred'})
    }
  }
}

function injectRedis(fn, redis) {
  return async (req, res) => {
    req.redis = redis
    return fn(req, res)
  }
}

module.exports = {
  handleErrors,
  injectRedis
}
