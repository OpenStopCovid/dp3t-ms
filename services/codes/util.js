function getExpireAt(ttl) {
  return new Date(Date.now() + (ttl * 1000))
}

function getCodeStorageKey(type, code) {
  return `${type === 'pincode' ? 'pin' : 'qr'}:${code}`
}

module.exports = {
  getCodeStorageKey,
  getExpireAt
}
