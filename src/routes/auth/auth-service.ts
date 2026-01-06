import { LoginUser, PublicUser, SignupUser, TokenUser } from '../../types/user'
import { add, getByEmail, makePublicUser } from '../users/users-service'
import bcrypt from 'bcrypt'
import { sign } from 'hono/jwt'
import { CookieOptions } from 'hono/utils/cookie'
import { HTTPException } from 'hono/http-exception'
import { loggerService } from '../../services/logger'

export async function loginService(user: LoginUser): Promise<PublicUser> {
	if (!user.email || !user.password) {
		throw new HTTPException(400, { message: 'Email or password are missing' })
	}

	const dbUser = await getByEmail(user.email)
	if (!dbUser) throw new HTTPException(400, { message: 'Invalid email or password' })

	const match = await bcrypt.compare(user.password, dbUser.password)
	if (!match) throw new HTTPException(400, { message: 'Invalid email or password' })

	loggerService.info(`Login success`)
	return makePublicUser(dbUser)
}

export async function signupService(user: SignupUser) {
	if (!user.username || !user.password || !user.fullname || !user.email) throw new HTTPException(400, { message: 'Missing required fields' })

	const existUser = await getByEmail(user.email)
	if (existUser) throw new HTTPException(409, { message: 'Email already taken' })

	const saltRounds = 10
	const hash = await bcrypt.hash(user.password, saltRounds)

	loggerService.info(`Signup seccess`)
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
	maxAge: 60 * 60 * 24
} as CookieOptions
