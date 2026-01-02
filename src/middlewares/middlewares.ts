import { verify } from 'hono/jwt'
import { loggerService } from '../services/logger'
import { getCookie } from 'hono/cookie'
import { getByEmail } from '../routes/users/users-service'

export async function requireAuth(c: any, next: any) {
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
		console.error(err)
		loggerService.error(err)
		return c.json({ error: 'Unauthorized' }, 401)
	}
}

export async function requireAdmin(c: any, next: any) {
	const loginToken = getCookie(c, 'loginToken')

	if (!loginToken) {
		return c.json({ error: 'Unauthorized' }, 401)
	}

	try {
		const validateToken = await verify(loginToken, process.env.JWT_SECRET!)
		if (!validateToken) return c.json({ error: 'Invalid token' }, 401)

		const loggedinUser = await getByEmail(validateToken.email as string)
		if (!loggedinUser?.isAdmin) throw new Error('Unauthorized access to statistics')

		c.set('loggedinUser', loggedinUser)
		await next()
	} catch (err) {
		console.error(err)
		loggerService.error(err)
		return c.json({ error: 'Unauthorized access' }, 401)
	}
}

