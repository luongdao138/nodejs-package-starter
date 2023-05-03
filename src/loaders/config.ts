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
    logger.warn(`
       [jwm-config] ⚠️ redis_url not found. A fake redis instance will be used.
     `)
  }

  if (!configModule?.projectConfig?.database_type) {
    logger.warn(`[jvm-config] ⚠️ database_type not found. fallback to default postgres.`)
  }

  return {
    projectConfig: {
      ...configModule.projectConfig,
    },
    plugins: configModule.plugins || [],
  }
}
