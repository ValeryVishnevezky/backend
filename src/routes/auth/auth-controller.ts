import { Context } from 'hono'
import { loginService, signupService, generateToken } from './auth-service'

export async function login(c: Context) {
	const user = await c.req.json()

	const loggedinUser = await loginService(user)
	const loginToken = await generateToken({ _id: loggedinUser._id, email: loggedinUser.email })

	return c.json({ user: loggedinUser, token: loginToken })
}

export async function signup(c: Context) {
	const user = await c.req.json()

	const addedUser = await signupService(user)
	const loggedinUser = await loginService({ email: addedUser.email, password: user.password })
	const loginToken = await generateToken({ _id: loggedinUser._id, email: loggedinUser.email })

	return c.json({ user: loggedinUser, token: loginToken })
}

export async function logout(c: Context) {
	return c.json({ msg: 'Logged out successfully' })
}
