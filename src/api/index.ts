import { Request, Response, Router } from 'express'

import { AppError, GlobalError } from '../common'
import { ConfigModule, Logger } from '../types'
import { AppContainer, formatException } from '../utils'
import initAdminRoute from './routes/admin'
import initFrontRoute from './routes/front'

// make sure to be accessible to all dependencies
export default function (container: AppContainer, config: ConfigModule) {
  const masterRoute = Router()

  // from master route, we devide into smaller routes (for now, just have front route and admin route)
  initFrontRoute(masterRoute, container, config)
  initAdminRoute(masterRoute, container, config)

  // error handlers
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  masterRoute.use((error: GlobalError, req: Request, res: Response, next) => {
    const logger = req.scope.resolve<Logger>('logger')

    const formattedError = formatException(error)
    logger.error(error)

    return res.status(Number(formattedError.code)).json(formattedError)
  })

  // not found handlers
  masterRoute.use('*', (req, res) => {
    const notFoundError = new AppError(AppError.Types.NOT_FOUND, 'Resource not found!')
    const formattedError = formatException(notFoundError)

    res.status(+formattedError.code).json(formattedError)
  })

  return masterRoute
}
