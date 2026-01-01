import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from './products-controller'

const products = new Hono()

products.get('/test', c => {
	loggerService.info('Products route accessed')
	return c.json({ message: 'Products route is working' })
})

products.get('/', getProducts)
products.get('/:id', getProduct)
products.delete('/:id', deleteProduct)
products.post('/', addProduct)
products.put('/:id', updateProduct)

export default products