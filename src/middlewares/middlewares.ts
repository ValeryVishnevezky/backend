import { verify } from 'hono/jwt'
import { loggerService } from '../services/logger'
import { getCookie } from 'hono/cookie'

export async function requireAuth(c: any, next: any) {
	const loginToken = getCookie(c, 'loginToken')
	console.log('loginToken:', loginToken)

	if (!loginToken) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	try {
		const validateToken = await verify(loginToken, process.env.JWT_SECRET!)

		if (!validateToken) return c.json({ error: 'Invalid token' }, 401)

		c.set('loggedinUser', validateToken)
		await next()
	} catch (err) {
		console.error(err)
		loggerService.error(err)
		return c.json({ error: 'Unauthorized' }, 401)
	}
}
