import { Hono } from 'hono'
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from './products-controller'
import { requireAdmin, requireAuth } from '../../middlewares/middlewares'

const products = new Hono()

products.get('/', getProducts)
products.get('/:id', getProduct)
products.delete('/:id', requireAuth, requireAdmin, deleteProduct)
products.post('/', requireAuth, requireAdmin, addProduct)
products.put('/:id', requireAuth, requireAdmin, updateProduct)

export default products
