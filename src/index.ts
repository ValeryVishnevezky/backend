import { Hono } from 'hono'
import { cors } from 'hono/cors'
import dotenv from 'dotenv'
dotenv.config()

import auth from './routes/auth/auth-route'
import users from './routes/users/users-route'
import products from './routes/products/products-route'
import orders from './routes/orders/orders-route'
import stats from './routes/stats/stats-route'

const app = new Hono()

app.use('*', cors({
		origin: ['http://localhost:3030', 'http://10.100.102.23:3030'],
		credentials: true
	})
)

app.route('/api/auth', auth)
app.route('/api/users', users)
app.route('/api/products', products)
app.route('/api/orders', orders)
app.route('/api/stats', stats)

export default app