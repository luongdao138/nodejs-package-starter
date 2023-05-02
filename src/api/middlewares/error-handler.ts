import { Request, Response } from 'express'

import { GlobalError } from '../../common'
import { Logger } from '../../types'
import { formatException } from '../../utils'

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default async function (error: GlobalError, req: Request, res: Response, next) {
  const logger = req.scope.resolve<Logger>('logger')

  const formattedError = formatException(error)
  logger.error(error)

  return res.status(Number(formattedError.code)).json(formattedError)
}
