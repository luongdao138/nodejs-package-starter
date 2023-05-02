import { dataSource } from '../loaders/database-loader'
import { User } from '../models'

export const UserRepository = dataSource.getRepository(User)
export default UserRepository
