import cors from 'cors'
import { Router } from 'express'

import { ConfigModule } from '../../../types'
import { AppContainer } from '../../../utils'
import { parseCorsOrigin } from '../../../utils/parse-cors-origin'

const frontRoute = Router()

export default function (masterRoute: Router, container: AppContainer, config: ConfigModule) {
  // apply front cors to front route
  const frontCors = parseCorsOrigin(config.projectConfig.front_cors || '')

  frontRoute.use(
    cors({
      credentials: true,
      origin: frontCors,
    }),
  )

  // init all children route belongs to front side

  masterRoute.use('/front', frontRoute)

  return masterRoute
}
