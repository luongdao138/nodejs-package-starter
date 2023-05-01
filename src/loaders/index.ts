import 'reflect-metadata'

import { asValue } from 'awilix'
import { track } from 'medusa-telemetry'
import { EOL } from 'os'

import logger from '../cli/reporter'
import { LoaderConfig, LoaderResult } from '../types/globals'
import { createAppContainer } from '../utils'
import loadConfig from './config'
import expressLoader from './express-loader'
import modelsLoader from './models-loader'
import redisLoader from './redis-loader'
import loadRequestContext from './request-context'

const appLoader = async ({ expressApp, directory }: LoaderConfig): Promise<LoaderResult> => {
  const configModule = loadConfig(directory)

  // create app container (awilix DI)
  const container = createAppContainer()

  // register resolved config module to container
  container.register('configModule', asValue(configModule))
  track('Config module loaded')

  // add additional information to context of the request
  loadRequestContext(expressApp)
  track('Request context loaded')

  // feature flag here => currently not available

  // register logger and feature flag router
  container.register({
    logger: asValue(logger),
  })

  // register redis database
  await redisLoader({ container, configModule, logger: logger as any })
  track('Redis DB inited')

  // load basic epxress app config
  await expressLoader({ app: expressApp })

  // load all db models
  const modelsActivity = logger.activity(`Initializing models${EOL}`)
  track('MODELS_INIT_STARTED')
  await modelsLoader({ container })
  const mAct = logger.success(modelsActivity, 'Models initialized') || {}
  track('MODELS_INIT_COMPLETED', { duration: mAct.duration })

  return { app: expressApp, container }
}

export default appLoader
