import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { Product, ProductFilter } from '../../types/product'
import { HTTPException } from 'hono/http-exception'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('products')
	let products = await collection.find(criteria).toArray()
	return products
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid product Id' })

	const collection = await dbService.getCollection('products')
	const product = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!product) throw new HTTPException(404, { message: 'Cannot find product' })

	return product
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid product Id' })

	const collection = await dbService.getCollection('products')
	const res = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) })

	if (res.deletedCount === 0) throw new HTTPException(400, { message: 'Cannot remove product' })

	return res
}

export async function update(product: Product) {
	if (!product._id || !ObjectId.isValid(product._id)) throw new HTTPException(400, { message: 'Invalid product Id' })

	const productToSave = {
		name: product.name,
		price: product.price,
		category: product.category,
		inStock: product.inStock,
		createdAt: product.createdAt,
		imgUrl: product.imgUrl || ''
	}
	const collection = await dbService.getCollection('products')
	const updatedProduct = await collection.updateOne({ _id: ObjectId.createFromHexString(product._id) }, { $set: productToSave })

	if (updatedProduct.modifiedCount === 0) throw new HTTPException(404, { message: 'Cannot update product' })

	return productToSave
}

export async function add(product: Product) {
	if (!product.name || !product.price || !product.category || typeof product.inStock !== 'boolean') {
		throw new HTTPException(400, { message: 'Missing required fields to add product' })
	}

	const productToAdd = {
		name: product.name,
		price: product.price,
		category: product.category,
		inStock: product.inStock,
		createdAt: new Date(),
		imgUrl: product.imgUrl || ''
	}
	const collection = await dbService.getCollection('products')
	const addedProduct = await collection.insertOne(productToAdd)

	if (!addedProduct.insertedId) throw new HTTPException(500, { message: 'Cannot add product' })

	return productToAdd
}

function _buildCriteria(filterBy: ProductFilter) {
	const criteria: any = {}
	if (filterBy.txt) {
		criteria.name = { $regex: filterBy.txt, $options: 'i' }
	}
	if (filterBy.minPrice != null || filterBy.maxPrice != null) {
		criteria.price = {}
		if (filterBy.minPrice != null) criteria.price.$gte = +filterBy.minPrice
		if (filterBy.maxPrice != null) criteria.price.$lte = +filterBy.maxPrice
	}
	if (filterBy.category) {
		criteria.category = { $regex: filterBy.category, $options: 'i' }
	}
	if (filterBy.inStock) {
		criteria.inStock = JSON.parse(filterBy.inStock)
	}
	return criteria
}
