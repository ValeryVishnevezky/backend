import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { Product, ProductFilter } from '../../types/product'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('products')
	let products = await collection.find(criteria).toArray()

	if (!products) throw new Error('Cannot find products in db')

	products = products.map(product => {
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

export async function update(product: Product) {
	if (!ObjectId.isValid(product._id)) throw new Error('Cannot update product | Invalid product ID')

	const productToSave = {
		name: product.name,
		price: product.price,
		category: product.category,
		inStock: product.inStock
	}
	const collection = await dbService.getCollection('products')
	const updatedProduct = await collection.updateOne({ _id: ObjectId.createFromHexString(product._id) }, { $set: productToSave })

	if (!updatedProduct) throw new Error('Cannot update product in db')

	return productToSave
}

export async function add(product: Product) {
	const productToAdd = {
		name: product.name,
		price: product.price,
		category: product.category,
		inStock: product.inStock
	}
	const collection = await dbService.getCollection('products')
	const addedProduct = await collection.insertOne(productToAdd)

	if (!addedProduct) throw new Error('Cannot add product to db')

	return productToAdd
}

function _buildCriteria(filterBy: ProductFilter) {
	const criteria: any = {}
	if (filterBy.txt) {
		criteria.name = { $regex: filterBy.txt, $options: 'i' }
	}
	if (filterBy.minPrice || filterBy.maxPrice) {
		criteria.price = {}
		if (filterBy.minPrice != null) criteria.price = {$gte: +filterBy.minPrice}
		if (filterBy.maxPrice != null) criteria.price = {$lte: +filterBy.maxPrice}
	}
	if (filterBy.category) {
		criteria.category = { $regex: filterBy.category, $options: 'i' }
	}
	if (filterBy.inStock) {
		criteria.inStock = JSON.parse(filterBy.inStock)
	}
	return criteria
}
