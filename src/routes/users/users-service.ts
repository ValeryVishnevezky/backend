import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { PublicUser, SignupUser, UserFilter } from '../../types/user'
import { HTTPException } from 'hono/http-exception'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('users')
	let dbUsers = await collection.find(criteria).toArray()
	return dbUsers
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid user Id' })

	const collection = await dbService.getCollection('users')
	const dbUser = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!dbUser) throw new HTTPException(404, { message: 'Cannot find user' })

	return makePublicUser(dbUser)
}

export async function getByEmail(email: string) {
	const collection = await dbService.getCollection('users')
	const user = await collection.findOne({ email })

	return user
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new HTTPException(400, { message: 'Invalid user Id' })

	const collection = await dbService.getCollection('users')
	const res = await collection.deleteOne({ _id: ObjectId.createFromHexString(id) })

	if (res.deletedCount === 0) throw new HTTPException(400, { message: 'Cannot remove user' })

	return res
}

export async function update(user: PublicUser) {
	if (!user._id || !ObjectId.isValid(user._id)) throw new HTTPException(400, { message: 'Invalid user Id' })

	const existUser = await getByEmail(user.email)
	if (existUser && existUser._id.toString() !== user._id) throw new HTTPException(409, { message: 'Email already taken' })

	const userToSave = {
		username: user.username,
		fullname: user.fullname,
		email: user.email
	}
	const collection = await dbService.getCollection('users')
	const res = await collection.updateOne({ _id: ObjectId.createFromHexString(user._id) }, { $set: userToSave })

	if (res.modifiedCount === 0) throw new HTTPException(404, { message: 'Cannot update user' })

	return userToSave
}

export async function add(user: SignupUser): Promise<PublicUser> {
	if (!user.username || !user.password || !user.fullname || !user.email) {
		throw new HTTPException(400, { message: 'Missing required fields to add user' })
	}

	const userToAdd = {
		username: user.username,
		password: user.password,
		fullname: user.fullname,
		isAdmin: false,
		email: user.email,
		createdAt: new Date()
	}
	const collection = await dbService.getCollection('users')
	const res = await collection.insertOne(userToAdd)

	if (!res.insertedId) throw new HTTPException(500, { message: 'Cannot add user' })

	return makePublicUser({ ...userToAdd, _id: res.insertedId })
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
		criteria.email = { $regex: filterBy.email, $options: 'i' }
	}
	return criteria
}

export function makePublicUser(user: any): PublicUser {
	return {
		_id: user._id.toString(),
		username: user.username,
		fullname: user.fullname,
		email: user.email,
		isAdmin: user.isAdmin || false,
		createdAt: user.createdAt
	}
}
