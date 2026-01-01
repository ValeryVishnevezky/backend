import { loggerService } from '../../services/logger'
import { LoginUser, User } from '../../types/user'
import { add, getByEmail } from '../users/users-service'
import bcrypt from 'bcrypt'

export async function loginService(user: LoginUser) {
	if (!user.email || !user.password) {
		throw new Error('Email or password are missing')
	}

	loggerService.info(`auth.service - login with email: ${user.email}`)
	const dbUser = await getByEmail(user.email)

	if (!dbUser) throw new Error('Invalid email or password')

	const match = await bcrypt.compare(user.password, dbUser.password)

	if (!match) throw new Error('Invalid email or password')

	delete dbUser.password
	return dbUser
}

export async function signupService(user: User) {
	console.log('user', user)
	if (!user.username || !user.password || !user.fullname) throw new Error('Missing details')
		
	const saltRounds = 10

	loggerService.info(`auth.service - signup with username: ${user.username}, fullname: ${user.fullname}`)
	const hash = await bcrypt.hash(user.password, saltRounds)
	return add({ ...user, password: hash })
}

export async function logoutService() {}
