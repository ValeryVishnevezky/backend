import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { addUser, deleteUser, getUser, getUsers, updateUser } from './users-controller'

const users = new Hono()

users.get('/test', c => {
	loggerService.info('Users route accessed')
	return c.json({ message: 'Users route is working' })
})

users.get('/', getUsers)
users.get('/:id', getUser)
users.delete('/:id', deleteUser)
users.post('/', addUser)
users.put('/:id', updateUser)

export default users
