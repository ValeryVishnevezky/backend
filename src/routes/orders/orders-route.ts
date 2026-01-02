import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { addOrder, deleteOrder, getOrder, getOrders, updateOrder } from './orders-controller'
import { requireAuth } from '../../middlewares/middlewares'

const orders = new Hono()

orders.get('/test', c => {
	{
		loggerService.info('Orders route accessed')
		return c.json({ message: 'Orders route is working' })
	}
})

orders.get('/', getOrders)
orders.get('/:id', getOrder)
orders.delete('/:id', requireAuth, deleteOrder)
orders.post('/', requireAuth, addOrder)
orders.put('/:id', requireAuth, updateOrder)

export default orders
