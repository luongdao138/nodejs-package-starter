import cors from 'cors'
import { Router } from 'express'

import { ConfigModule } from '../../../types'
import { AppContainer } from '../../../utils'
import { parseCorsOrigin } from '../../../utils/parse-cors-origin'
// children routes
import initUserRoutes from './user'

const adminRoute = Router()

export default function (masterRoute: Router, container: AppContainer, config: ConfigModule) {
  // apply front cors to front route
  const adminCors = parseCorsOrigin(config.projectConfig.admin_cors || '')

  adminRoute.use(
    cors({
      credentials: true,
      origin: adminCors,
    }),
  )

  // init all children route belongs to admin side
  initUserRoutes(adminRoute) // demo purpose

  masterRoute.use('/admin', adminRoute)

  return masterRoute
}
