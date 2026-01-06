import { verify } from 'hono/jwt'
import { loggerService } from '../services/logger'
import { getCookie } from 'hono/cookie'
import { getByEmail } from '../routes/users/users-service'
import { Context, Next } from 'hono'
import { HTTPException } from 'hono/http-exception'

export async function requireAuth(c: Context, next: Next) {
	const loginToken = getCookie(c, 'loginToken')

	if (!loginToken) {
		loggerService.error('No token provided')
		throw new HTTPException(401, { message: 'Unauthorized' })
	}

	try {
		const validateToken = await verify(loginToken, process.env.JWT_SECRET!)
		if (!validateToken) {
			loggerService.error('Invalid token')
			throw new HTTPException(401, { message: 'Invalid token' })
		}

		const loggedinUser = await getByEmail(validateToken.email as string)
		if (!loggedinUser) {
			loggerService.error('User not found')
			throw new HTTPException(401, { message: 'User not found' })
		}

		c.set('loggedinUser', loggedinUser)
		await next()
	} catch (err) {
		loggerService.error(err)
		throw new HTTPException(401, { message: 'Unauthorized' })
	}
}

export async function requireAdmin(c: Context, next: Next) {
	const user = c.get('loggedinUser')

	if (!user?.isAdmin) {
		loggerService.error('Unauthorized access')
		throw new HTTPException(403, { message: 'Unauthorized access' })
	}
	await next()
}
