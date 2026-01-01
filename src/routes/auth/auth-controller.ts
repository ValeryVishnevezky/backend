import { Context } from 'hono'
import { loginService, signupService, logoutService } from './auth-service'

export async function login(c: Context) {
	const user = await c.req.json()
	const loggedinUser = await loginService(user)
	return c.json(loggedinUser)
}

export async function signup(c: Context) {
	const user = await c.req.json()
	console.log('user', user)

	const loggedinUser = await signupService(user)
	return c.json(loggedinUser)
}

export async function logout(c: Context) {
	await logoutService()
	return c.json({ msg: 'Logged out successfully' })
}