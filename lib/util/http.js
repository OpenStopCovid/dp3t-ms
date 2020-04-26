const {send, createError} = require('micro')

function methodNotAllowed(message = 'Method not allowed') {
  throw createError(405, message)
}

function forbidden(message = 'Forbidden') {
  throw createError(403, message)
}

function badRequest(message = 'Bad request') {
  throw createError(400, message)
}

function notFound(message = 'Not found') {
  throw createError(404, message)
}

function noContent(res) {
  return send(res, 204)
}

module.exports = {
  methodNotAllowed,
  forbidden,
  badRequest,
  notFound,
  noContent
}
