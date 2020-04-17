const {send} = require('micro')

function methodNotAllowed(res) {
  return send(res, 405)
}

function forbidden(res, message) {
  return send(res, 403, {
    code: 403,
    message
  })
}

function badRequest(res, message) {
  return send(res, 400, {
    code: 400,
    message
  })
}

module.exports = {
  methodNotAllowed,
  forbidden,
  badRequest
}
