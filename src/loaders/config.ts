import { ConfigModule } from '../types'

export default function (rootDirectory: string): ConfigModule {
  return {
    projectConfig: {
      database_logging: true,
      database_type: '',
      admin_cors: '',
      redis_url: '',
      jwt_secret: '',
      database_url: '',
      front_cors: rootDirectory,
    },
  }
}
