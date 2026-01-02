import { ObjectId } from 'mongodb'
import { dbService } from '../../services/db'
import { PublicUser, SignupUser, UserFilter } from '../../types/user'

export async function query(filterBy = {}) {
	const criteria = _buildCriteria(filterBy)
	const collection = await dbService.getCollection('users')
	let dbUsers = await collection.find(criteria).toArray()

	if (!dbUsers) throw new Error('Cannot find users in db')

	let users = dbUsers.map(dbUser => {
		let publicUser = makePublicUser(dbUser)
		return {
			...publicUser,
			createdAt: new ObjectId(dbUser._id).getTimestamp()
		}
	})
	return users
}

export async function getById(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Invalid user ID')

	const collection = await dbService.getCollection('users')
	const dbUser = await collection.findOne({ _id: ObjectId.createFromHexString(id) })

	if (!dbUser) throw new Error('Cannot find user by id in db')

	return makePublicUser(dbUser)
}

export async function getByEmail(email: string) {
	const collection = await dbService.getCollection('users')
	const user = await collection.findOne({ email })

	return user
}

// export async function getByName(username: string) {
// 	const collection = await dbService.getCollection('users')
// 	const user = await collection.findOne({ username })

// 	if (!user) {
// 		const user = await collection.findOne({ email: username })
// 		if (!user) throw new Error('Cannot find user by username or email in db')
// 	}

// 	return user
// }

export async function remove(id: string) {
	if (!ObjectId.isValid(id)) throw new Error('Cannot remove user | Invalid user ID')

	const collection = await dbService.getCollection('users')
	const res = await collection.deleteOne({
		_id: ObjectId.createFromHexString(id)
	})

	if (!res) throw new Error('Cannot remove user from db')

	return res
}

export async function update(user: PublicUser) {
	if (!ObjectId.isValid(user._id)) throw new Error('Cannot update user | Invalid user ID')

	const userToSave = {
		username: user.username,
		fullname: user.fullname,
		email: user.email
	}
	const collection = await dbService.getCollection('users')
	const res = await collection.updateOne({ _id: ObjectId.createFromHexString(user._id) }, { $set: userToSave })

	if (!res) throw new Error('Cannot update user in db')

	return userToSave
}

export async function add(user: SignupUser): Promise<PublicUser> {
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
	console.log('res', res)

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
		isAdmin: user.isAdmin || false
	}
}
