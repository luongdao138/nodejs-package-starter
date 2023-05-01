import { asValue } from 'awilix'
import Redis from 'ioredis'
import FakeRedis from 'ioredis-mock'
import { EOL } from 'os'

import { ConfigModule, Logger } from '../types'
import { AppContainer } from '../utils'

type Options = {
  container: AppContainer
  logger: Logger
  configModule: ConfigModule
}

const isProduction = process.env.NODE_ENV === 'production' || process.env.NODE_ENV === 'prod'

export default async function ({ container, configModule, logger }: Options) {
  if (configModule.projectConfig.redis_url) {
    const redisClient = new Redis(configModule.projectConfig.redis_url, {
      lazyConnect: true,
    })

    try {
      await redisClient.connect()
      logger.info('Connection to Redis established')
    } catch (error) {
      logger.error(`An error occur while connect to Redis: ${EOL} ${error}`)
    }

    // register redis client instance after connection
    container.register({
      redisClient: asValue(redisClient),
    })
  } else {
    // warning if in production environment
    if (isProduction) {
      logger.warn(`No Redis url was provided - using in production without a proper Redis instance is not recommended`)
    }

    logger.info('Using fake Redis')

    // Economical way of dealing with redis clients
    const client = new FakeRedis()

    container.register({
      redisClient: asValue(client),
    })
  }
}
