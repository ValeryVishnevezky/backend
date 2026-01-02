import { Context } from 'hono'
import { query, getById, remove, update, add } from './users-service'

export async function getUsers(c: Context) {
	const filterBy = c.req.query()
	const users = await query(filterBy)
	return c.json(users)
}

export async function getUser(c: Context) {
	const id = c.req.param('id')
	const user = await getById(id)
	return c.json(user)
}

export async function deleteUser(c: Context) {
	const id = c.req.param('id')
	await remove(id)
	return c.json({ msg: 'Deleted successfully' })
}

export async function updateUser(c: Context) {
	const id = c.req.param('id')
	const user = await c.req.json()
	const savedUser = await update({ ...user, _id: id })
	return c.json(savedUser)
}

export async function addUser(c: Context) {
	const user = await c.req.json()
	const savedUser = await add(user)
	return c.json(savedUser)
}
