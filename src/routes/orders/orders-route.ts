import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { addOrder, deleteOrder, getOrder, getOrders, updateOrder } from './orders-controller'

const orders = new Hono()

orders.get('/test', (c) => { {
	loggerService.info('Orders route accessed')
	return c.json({ message: 'Orders route is working' })
} })

orders.get('/', getOrders)
orders.get('/:id', getOrder)
orders.delete('/:id', deleteOrder)
orders.post('/', addOrder)
orders.put('/:id', updateOrder)

export default orders