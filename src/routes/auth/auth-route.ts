import { Hono } from 'hono'
import { login, signup, logout } from './auth-controller'

const auth = new Hono()

auth.post('/login', login)
auth.post('/signup', signup)
auth.post('/logout', logout)

export default auth
