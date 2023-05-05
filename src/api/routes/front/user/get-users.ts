import { Request, Response } from 'express'
import { z } from 'zod'

const userSchema = z.object({
  name: z.string().min(10),
  age: z.number().min(10),
})

/**
 * @oas [get] /users
 * operationId: "GetUsers"
 * summary: "Get list user demo"
 * description: "Get list user demo"
 * tags:
 *   - User
 * responses:
 *   200:
 *     description: OK
 *     content:
 *       application/json:
 *         schema:
 *            type: array
 *            items:
 *               type: object
 *               properties:
 *                  name:
 *                    type: string
 *                    description: Name of user
 *                    example: John Doe
 *                  age:
 *                    type: string
 *                    description: Age of user
 *                    example: 24
 */

export default async function (req: Request, res: Response) {
  const validated = userSchema.parse({
    name: 'dao van luong',
    age: 21,
  })
  res.json([validated])
}
