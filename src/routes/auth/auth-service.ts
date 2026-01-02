import { loggerService } from '../../services/logger'
import { LoginUser, PublicUser, SignupUser, TokenUser } from '../../types/user'
import { add, getByEmail, makePublicUser } from '../users/users-service'
import { sign } from 'hono/jwt'
import bcrypt from 'bcrypt'
import { CookieOptions } from 'hono/utils/cookie'

export async function loginService(user: LoginUser): Promise<PublicUser> {
	if (!user.email || !user.password) {
		throw new Error('Email or password are missing')
	}

	loggerService.info(`auth.service - login with email: ${user.email}`)
	const dbUser = await getByEmail(user.email)

	if (!dbUser) throw new Error('Invalid email or password')

	const match = await bcrypt.compare(user.password, dbUser.password)

	if (!match) throw new Error('Invalid email or password')

	return makePublicUser(dbUser)
}

export async function signupService(user: SignupUser) {
	console.log('user', user)
	if (!user.username || !user.password || !user.fullname) throw new Error('Missing details')

	const saltRounds = 10

	loggerService.info(`auth.service - signup with username: ${user.username}, fullname: ${user.fullname}`)
	const hash = await bcrypt.hash(user.password, saltRounds)

	return add({ ...user, password: hash })
}

export async function generateToken(user: TokenUser) {
	return await sign(
		{
			_id: user._id,
			email: user.email,
			exp: Math.floor(Date.now() / 1000) + 60 * 60 * 24
		},
		process.env.JWT_SECRET!
	)
}

export const cookieOptions = {
	httpOnly: true,
	secure: process.env.NODE_ENV === 'production',
	sameSite: 'Lax',
	path: '/',
	maxAge: 60 * 60 * 24,
} as CookieOptions