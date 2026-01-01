import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { User, UserFilter } from '../../types/user'

export async function query(filterBy = {}) {
	console.log('filterBy', filterBy)
	const criteria = _buildCriteria(filterBy)
	console.log('criteria', criteria)
	const collection = await dbService.getCollection('products')
	let products = await collection.find(criteria).toArray()

	if (!products) throw new Error('Cannot find products in db')

	products = products.map(product => {
		delete product.password
		product.createdAt = new ObjectId(product._id).getTimestamp()
		return product
	})
	return products
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Invalid product ID')

	const collection = await dbService.getCollection('products')
	const product = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!product) throw new Error('Cannot find product by id in db')

	delete product?.password
	return product
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Cannot remove product | Invalid product ID')

	const collection = await dbService.getCollection('products')
	const res = await collection.deleteOne({
		_id: ObjectId.createFromHexString(id)
	})

	if (!res) throw new Error('Cannot remove product from db')

	return res
}

export async function update(product: User) {
	if (!ObjectId.isValid(product._id)) throw new Error('Cannot update product | Invalid product ID')

	const productToSave = {
		username: product.username,
		password: product.password,
		fullname: product.fullname,
		email: product.email
	}
	const collection = await dbService.getCollection('products')
	const res = await collection.updateOne({ _id: ObjectId.createFromHexString(product._id) }, { $set: productToSave })

	if (!res) throw new Error('Cannot update product in db')

	return productToSave
}

export async function add(user: User) {
	const userToAdd = {
		username: user.username,
		password: user.password,
		fullname: user.fullname,
		isAdmin: false,
		email: user.email
	}
	const collection = await dbService.getCollection('users')
	const res = await collection.insertOne(userToAdd)

	if (!res) throw new Error('Cannot add user to db')

	return userToAdd
}

function _buildCriteria(filterBy: UserFilter) {
	const criteria: any = {}
	if (filterBy.txt) {
		const txtCriteria = { $regex: filterBy.txt, $options: 'i' }
		criteria.$or = [
			{
				username: txtCriteria
			},
			{
				fullname: txtCriteria
			}
		]
	}
	if (filterBy.email) {
		const emailCriteria = { $regex: filterBy.email, $options: 'i' }
		criteria.email = emailCriteria
	}
	return criteria
}
