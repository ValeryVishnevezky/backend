import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { User, UserFilter } from '../../types/user'

export async function query(filterBy = {}) {
	console.log('filterBy', filterBy)
	const criteria = _buildCriteria(filterBy)
	console.log('criteria', criteria)
	const collection = await dbService.getCollection('users')
	let users = await collection.find(criteria).toArray()

	if (!users) throw new Error('Cannot find users in db')

	users = users.map(user => {
		delete user.password
		user.createdAt = new ObjectId(user._id).getTimestamp()
		return user
	})
	return users
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Invalid user ID')

	const collection = await dbService.getCollection('users')
	const user = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!user) throw new Error('Cannot find user by id in db')

	delete user?.password
	return user
}

export async function getByEmail(email: string) {
	const collection = await dbService.getCollection('users')
	const user = await collection.findOne({ email })

	return user
}

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Cannot remove user | Invalid user ID')

	const collection = await dbService.getCollection('users')
	const res = await collection.deleteOne({
		_id: ObjectId.createFromHexString(id)
	})

	if (!res) throw new Error('Cannot remove user from db')

	return res
}

export async function update(user: User) {
	if (!ObjectId.isValid(user._id)) throw new Error('Cannot update user | Invalid user ID')

	const userToSave = {
		username: user.username,
		password: user.password,
		fullname: user.fullname,
		email: user.email
	}
	const collection = await dbService.getCollection('users')
	const res = await collection.updateOne({ _id: ObjectId.createFromHexString(user._id) }, { $set: userToSave })

	if (!res) throw new Error('Cannot update user in db')

	return userToSave
}

export async function add(user: User) {
	const existUser = await getByEmail(user.email)

	if (existUser) throw new Error('Cannot add user | Email taken')

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
