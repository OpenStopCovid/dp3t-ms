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

module.exports = {
  methodNotAllowed,
  forbidden,
  badRequest,
  notFound,
  noContent
}
