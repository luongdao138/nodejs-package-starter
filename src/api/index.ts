import { Router } from 'express'

import { ConfigModule } from '../types'
import { AppContainer } from '../utils'
import errorHandler from './middlewares/error-handler'
import initAdminRoute from './routes/admin'
import initFrontRoute from './routes/front'

// make sure to be accessible to all dependencies
export default function (container: AppContainer, config: ConfigModule) {
  const masterRoute = Router()

  // from master route, we devide into smaller routes (for now, just have front route and admin route)
  initFrontRoute(masterRoute, container, config)
  initAdminRoute(masterRoute, container, config)

  // error handlers
  masterRoute.use(errorHandler)

  return masterRoute
}
