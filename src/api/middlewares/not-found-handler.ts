import { Request, Response } from 'express'

import { AppError } from '../../common'
import { formatException } from '../../utils'

export default function (req: Request, res: Response) {
  const notFoundError = new AppError(AppError.Types.NOT_FOUND, 'Resource not found!')
  const formattedError = formatException(notFoundError)

  res.status(+formattedError.code).json(formattedError)
}
