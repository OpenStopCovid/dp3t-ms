const {join} = require('path')
const test = require('ava')
const {readYamlSync} = require('../yaml')

test('read YAML file', t => {
  const data = readYamlSync(join(__dirname, 'sample-file.yaml'))
  t.deepEqual(data, {foo: 'bar'})
})
