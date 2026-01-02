import { Hono } from 'hono'
import { addOrder, deleteOrder, getOrder, getOrders, updateOrder } from './orders-controller'
import { requireAuth } from '../../middlewares/middlewares'

const orders = new Hono()

orders.get('/', getOrders)
orders.get('/:id', getOrder)
orders.delete('/:id', requireAuth, deleteOrder)
orders.post('/', requireAuth, addOrder)
orders.put('/:id', requireAuth, updateOrder)

export default orders
