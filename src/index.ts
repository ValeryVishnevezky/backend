import { Hono } from 'hono'
import dotenv from 'dotenv'
dotenv.config()

import auth from './routes/auth/auth-route'
import users from './routes/users/users-route'
import products from './routes/products/products-route'
import orders from './routes/orders/orders-route'
import stats from './routes/stats/stats-route'

const app = new Hono()

app.route('/auth', auth)
app.route('/users', users)
app.route('/products', products)
app.route('/orders', orders)
app.route('/stats', stats)

export default app

// console.log('Listening on http://localhost:3000')
