import { Context } from 'hono'
import { query, getById, remove, update, add } from './orders-service'

export async function getOrders(c: Context) {
	const filterBy = c.req.query()
	const orders = await query(filterBy)
	return c.json(orders)
}

export async function getOrder(c: Context) {
	const id = c.req.param('id')
	const order = await getById(id)
	return c.json(order)
}

export async function deleteOrder(c: Context) {
	const id = c.req.param('id')
	await remove(id)
	return c.json({ msg: 'Deleted successfully' })
}

export async function updateOrder(c: Context) {
	const id = c.req.param('id')
	const order = await c.req.json()
	const loggedinUser = c.get('loggedinUser')
	const savedOrder = await update({ ...order, _id: id, customer: loggedinUser })
	return c.json(savedOrder)
}

export async function addOrder(c: Context) {
	const order = await c.req.json()
	const loggedinUser = c.get('loggedinUser')
	console.log('loggedinUser:', loggedinUser)
	const savedOrder = await add({ ...order, customer: loggedinUser })
	return c.json(savedOrder)
}
