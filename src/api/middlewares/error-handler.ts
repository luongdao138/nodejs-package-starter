import { NextFunction, Request, Response } from 'express'

import { GlobalError } from '../../common'

export default async function (error: GlobalError, req: Request, res: Response, next: NextFunction) {
  next()
}
