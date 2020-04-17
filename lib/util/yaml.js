const {readFileSync} = require('fs')
const {safeLoad} = require('js-yaml')

function readYamlSync(filePath) {
  return safeLoad(readFileSync(filePath))
}

module.exports = {readYamlSync}
