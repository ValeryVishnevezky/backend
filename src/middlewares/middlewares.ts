import { verify } from 'hono/jwt'
import { loggerService } from '../services/logger'
import { getCookie } from 'hono/cookie'
import { getByEmail } from '../routes/users/users-service'
import { Context, Next } from 'hono'

export async function requireAuth(c: Context, next: Next) {
	const loginToken = getCookie(c, 'loginToken')

	if (!loginToken) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	try {
		const validateToken = await verify(loginToken, process.env.JWT_SECRET!)
		if (!validateToken) return c.json({ error: 'Invalid token' }, 401)

		const loggedinUser = await getByEmail(validateToken.email as string)

		c.set('loggedinUser', loggedinUser)
		await next()
	} catch (err) {
		loggerService.error(err)
		return c.json({ error: 'Unauthorized' }, 401)
	}
}

export async function requireAdmin(c: Context, next: Next) {
	const loginToken = getCookie(c, 'loginToken')

	if (!loginToken) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	try {
		const validateToken = await verify(loginToken, process.env.JWT_SECRET!)
		if (!validateToken) return c.json({ error: 'Invalid token' }, 401)

		const loggedinUser = await getByEmail(validateToken.email as string)
		if (!loggedinUser?.isAdmin) throw new Error('Unauthorized access')

		c.set('loggedinUser', loggedinUser)
		await next()
	} catch (err) {
		loggerService.warn(err)
		return c.json({ error: 'Unauthorized access' }, 401)
	}
}
