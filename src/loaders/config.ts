import logger from '../cli/reporter'
import { ConfigModule } from '../types'
import getConfigFile from '../utils/get-config-file'

function handleConfigError(error: Error) {
  logger.error(`Error when loading config: ${error.message}`)

  if (error.stack) {
    logger.error(error.stack)
  }

  process.exit(1)
}

export default function (rootDirectory: string): ConfigModule {
  const { configModule, configFilePath, error } = getConfigFile<ConfigModule>(rootDirectory, 'jvm-config.js')

  if (error) {
    handleConfigError(error)
  }

  logger.info(`Loaded config module with path: ${configFilePath}`)

  if (!configModule?.projectConfig?.redis_url) {
    logger.error(`
       [jwm-config] ⚠️ redis_url not found. A fake redis instance will be used.
     `)
  }

  return {
    projectConfig: {
      ...configModule.projectConfig,
    },
  }
}
