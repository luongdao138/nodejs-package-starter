import { DataSource, DataSourceOptions } from 'typeorm'

import { ConfigModule } from '../types'
import { AppContainer } from '../utils'

type Options = {
  container: AppContainer
  configModule: ConfigModule
  customOptions?: {
    migrations: DataSourceOptions['migrations']
    logging: DataSourceOptions['logging']
  }
}

let datasource: DataSource

export default async function ({ container, configModule, customOptions }: Options): Promise<DataSource> {
  // get all entities from awilix container
  const entities = container.resolve('db_entities')

  // init typeorm datasource (not support sqlite)
  datasource = new DataSource({
    type: configModule?.projectConfig.database_type ?? 'postgres',
    url: configModule.projectConfig.database_url,
    database: configModule.projectConfig.database_database,
    extra: configModule.projectConfig.database_extra ?? {},
    schema: configModule.projectConfig.database_schema,
    entities,
    migrations: customOptions?.migrations,
    logging: customOptions?.logging ?? configModule.projectConfig.database_logging ?? false,
  } as DataSourceOptions)

  await datasource.initialize()

  return datasource
}
