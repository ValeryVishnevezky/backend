import { Hono } from 'hono'
import { loggerService } from '../../services/logger'

const orders = new Hono()

orders.get('/test', (c) => { {
	loggerService.info('Orders route accessed')
	return c.json({ message: 'Orders route is working' })
} })

export default orders
