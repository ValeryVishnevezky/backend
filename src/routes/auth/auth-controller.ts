import { Context } from 'hono'
import { loginService, signupService, generateToken, cookieOptions } from './auth-service'
import { deleteCookie, setCookie } from 'hono/cookie'

export async function login(c: Context) {
	const user = await c.req.json()

	const loggedinUser = await loginService(user)
	const loginToken = await generateToken({ _id: loggedinUser._id, email: loggedinUser.email })

	setCookie(c, 'loginToken', loginToken, cookieOptions)
	return c.json({ user: loggedinUser })
}

export async function signup(c: Context) {
	const user = await c.req.json()

	const addedUser = await signupService(user)
	const loggedinUser = await loginService({ email: addedUser.email, password: user.password })
	const loginToken = await generateToken({ _id: loggedinUser._id, email: loggedinUser.email })

	setCookie(c, 'loginToken', loginToken, cookieOptions)
	return c.json({ user: loggedinUser })
}

export async function logout(c: Context) {
 deleteCookie(c, 'loginToken', {
		httpOnly: true,
		secure: process.env.NODE_ENV === 'production',
		sameSite: 'Lax',
		path: '/'
	})
	return c.json({ message: 'Logged out successfully' })
}
