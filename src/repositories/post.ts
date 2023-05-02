import { dataSource } from '../loaders/database-loader'
import { Post } from '../models'

export const PostRepository = dataSource.getRepository(Post)
export default PostRepository
