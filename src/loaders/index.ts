import { asValue } from 'awilix'
import { track } from 'medusa-telemetry'

import logger from '../cli/reporter'
import { LoaderConfig, LoaderResult } from '../types/globals'
import { createAppContainer } from '../utils'
import loadConfig from './config'
import expressLoader from './express-loader'
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

  // load basic epxress app config
  expressLoader({ app: expressApp })

  return { app: expressApp, container }
}

export default appLoader
