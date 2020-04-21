const Redis = require('ioredis')

function createRedis(connectionString, options) {
  const redisInstance = new Redis(connectionString, options)

  process.on('SIGINT', () => redisInstance.quit())
  process.on('SIGTERM', () => redisInstance.quit())
  process.on('exit', () => redisInstance.quit())

  return redisInstance
}

module.exports = {createRedis}
