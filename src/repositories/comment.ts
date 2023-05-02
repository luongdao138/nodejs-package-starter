import { dataSource } from '../loaders/database-loader'
import { Comment } from '../models'

export const CommentRepository = dataSource.getRepository(Comment)
export default CommentRepository
