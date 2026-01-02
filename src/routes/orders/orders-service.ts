import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { Order, OrderFilter } from '../../types/order'
import { HTTPException } from 'hono/http-exception'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('orders')
	let orders = await collection.find(criteria).toArray()

	if (!orders.length) throw new HTTPException(404, { message: 'Cannot find orders' })

	const dates = [new Date('2026-01-01T12:00:00Z'), new Date('2026-01-02T12:00:00Z'), new Date('2025-11-02T12:00:00Z'), new Date('2025-09-03T12:00:00Z'), new Date('2025-08-03T12:00:00Z')]
	orders = orders.map(order => {
		// order.createdAt = new ObjectId(order._id).getTimestamp()
		order.createdAt = dates[Math.floor(Math.random() * dates.length)]
		return order
	})
	return orders
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid order Id' })

	const collection = await dbService.getCollection('orders')
	const order = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!order) throw new HTTPException(404, { message: 'Cannot find order' })

	return order
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid order Id' })

	const collection = await dbService.getCollection('orders')
	const res = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) })

	if (res.deletedCount === 0) throw new HTTPException(400, { message: 'Cannot remove order' })

	return res
}

export async function update(order: Order) {
	if (!order._id || !ObjectId.isValid(order._id)) throw new HTTPException(400, { message: 'Invalid order Id' })

	const orderToSave = {
		product: {
			_id: ObjectId.createFromHexString(order.product._id),
			name: order.product.name,
			price: order.product.price,
			category: order.product.category
		},
		customer: {
			_id: ObjectId.createFromHexString(order.customer._id),
			username: order.customer.username,
			email: order.customer.email
		},
		status: order.status,
		quantity: order.quantity,
		totalPrice: order.totalPrice
	}
	const collection = await dbService.getCollection('orders')
	const updatedOrder = await collection.updateOne({ _id: ObjectId.createFromHexString(order._id) }, { $set: orderToSave })

	if (updatedOrder.matchedCount === 0) throw new HTTPException(400, { message: 'Cannot update order' })

	return orderToSave
}

export async function add(order: Order) {
	const orderToAdd = {
		product: {
			_id: ObjectId.createFromHexString(order.product._id),
			name: order.product.name,
			price: order.product.price,
			category: order.product.category
		},
		customer: {
			_id: order.customer._id,
			username: order.customer.username,
			email: order.customer.email
		},
		status: 'panding',
		quantity: order.quantity,
		totalPrice: order.totalPrice
	}

	const collection = await dbService.getCollection('orders')
	const addedOrder = await collection.insertOne(orderToAdd)

	if (!addedOrder.insertedId) throw new HTTPException(400, { message: 'Cannot add order' })

	return orderToAdd
}

function _buildCriteria(filterBy: OrderFilter) {
	const criteria: any = {}
	if (filterBy.productId) {
		criteria['product._id'] = filterBy.productId
	}
	if (filterBy.category) {
		criteria['product.category'] = filterBy.category
	}
	if (filterBy.customerId) {
		criteria['customer._id'] = filterBy.customerId
	}
	if (filterBy.status) {
		criteria.status = { $regex: filterBy.status, $options: 'i' }
	}
	if (filterBy.totalMinPrice || filterBy.totalMaxPrice) {
		criteria.totalPrice = {}
		if (filterBy.totalMinPrice != null) criteria.totalPrice = { $gte: +filterBy.totalMinPrice }
		if (filterBy.totalMaxPrice != null) criteria.totalPrice = { $lte: +filterBy.totalMaxPrice }
	}
	if (filterBy.quantity) {
		criteria.quantity = { $eq: +filterBy.quantity }
	}
	return criteria
}
