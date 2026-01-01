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
	const product = await c.req.json()
	const savedOrder = await update({ ...product, _id: id })
	return c.json(savedOrder)
}

export async function addOrder(c: Context) {
	const product = await c.req.json()
	const savedOrder = await add(product)
	return c.json(savedOrder)
}