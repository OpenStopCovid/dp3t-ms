const test = require('ava')
const {getCodeStorageKey, getExpireAt} = require('../util')

test('getCodeStorageKey', t => {
  t.is(getCodeStorageKey('qrcode', '123'), 'qr:123')
  t.is(getCodeStorageKey('pincode', '456'), 'pin:456')
})

test('getExpireAt', t => {
  const expireAt = getExpireAt(30)
  const diff = (expireAt - Date.now()) / 1000
  t.is(Math.round(diff), 30)
})
