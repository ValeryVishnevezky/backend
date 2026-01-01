import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { login, signup, logout } from './auth-controller'

const auth = new Hono()

auth.get('/test', (c) => { {
	loggerService.info('Auth route accessed')
	return c.json({ message: 'Auth route is working' })
} })

auth.post('/login', login)
auth.post('/signup', signup)
auth.post('/logout', logout)

export default auth