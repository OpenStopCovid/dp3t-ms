const {send, createError} = require('micro')

function methodNotAllowed() {
  throw createError(405, 'Method not allowed')
}

function forbidden(message) {
  throw createError(403, message)
}

function badRequest(message) {
  throw createError(400, message)
}

function notFound(message) {
  throw createError(404, message || 'Not found')
}

function noContent(res) {
  return send(res, 204)
}

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
  methodNotAllowed,
  forbidden,
  badRequest,
  notFound,
  noContent,
  handleErrors
}
