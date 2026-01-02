import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from './products-controller'
import { requireAuth } from '../../middlewares/middlewares'

const products = new Hono()

products.get('/test', c => {
	loggerService.info('Products route accessed')
	return c.json({ message: 'Products route is working' })
})

products.get('/', getProducts)
products.get('/:id', getProduct)
products.delete('/:id', requireAuth, deleteProduct)
products.post('/', requireAuth, addProduct)
products.put('/:id', requireAuth, updateProduct)

export default products
