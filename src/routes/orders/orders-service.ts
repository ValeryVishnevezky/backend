import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { Order, OrderFilter } from '../../types/order'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('orders')
	let orders = await collection.find(criteria).toArray()

	if (!orders.length) throw new Error('Cannot find orders in db')

	const dates = [new Date('2026-01-01T12:00:00Z'), new Date('2026-01-02T12:00:00Z'), new Date('2025-11-02T12:00:00Z'), new Date('2025-09-03T12:00:00Z'), new Date('2025-08-03T12:00:00Z')]
	orders = orders.map(order => {
		// order.createdAt = new ObjectId(order._id).getTimestamp()
		order.createdAt = dates[Math.floor(Math.random() * dates.length)]
		return order
	})
	return orders
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Invalid order ID')

	const collection = await dbService.getCollection('orders')
	const order = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!order) throw new Error('Cannot find order by id in db')

	return order
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Cannot remove order | Invalid order ID')

	const collection = await dbService.getCollection('orders')
	const res = await collection.deleteOne({
		_id: ObjectId.createFromHexString(id)
	})

	if (!res) throw new Error('Cannot remove order from db')

	return res
}

export async function update(order: Order) {
	if (!order._id || !ObjectId.isValid(order._id)) throw new Error('Cannot update order | Invalid order ID')

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

	if (!updatedOrder) throw new Error('Cannot update order in db')

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

	if (!addedOrder) throw new Error('Cannot add order to db')

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
