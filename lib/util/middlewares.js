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

      console.error(error)
      send(res, 500, {code: 500, message: 'An unexpected error has occurred'})
    }
  }
}

module.exports = {
  handleErrors
}
