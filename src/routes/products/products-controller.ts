import { Context } from 'hono'
import { query, getById, remove, update, add } from './products-service'

export async function getProducts(c: Context) {
	const filterBy = c.req.query()
	const products = await query(filterBy)
	return c.json(products)
}

export async function getProduct(c: Context) {
	const id = c.req.param('id')
	const product = await getById(id)
	return c.json(product)
}

export async function deleteProduct(c: Context) {
	const id = c.req.param('id')
	await remove(id)
	return c.json({ msg: 'Deleted successfully' })
}

export async function updateProduct(c: Context) {
	const id = c.req.param('id')
	const product = await c.req.json()
	const savedProduct = await update({ ...product, _id: id })
	return c.json(savedProduct)
}

export async function addProduct(c: Context) {
	const product = await c.req.json()
	const savedProduct = await add(product)
	return c.json(savedProduct)
}