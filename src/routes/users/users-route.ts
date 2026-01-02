import { Hono } from 'hono'
import { deleteUser, getUser, getUsers, updateUser } from './users-controller'
import { requireAuth } from '../../middlewares/middlewares'

const users = new Hono()

users.get('/', getUsers)
users.get('/:id', getUser)
users.delete('/:id', requireAuth, deleteUser)
users.put('/:id', requireAuth, updateUser)

export default users
