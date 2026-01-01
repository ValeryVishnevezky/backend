import { Hono } from 'hono'
import { loggerService } from '../../services/logger'

const auth = new Hono()

auth.get('/test', (c) => { {
	loggerService.info('Auth route accessed')
	return c.json({ message: 'Auth route is working' })
} })


export default auth

