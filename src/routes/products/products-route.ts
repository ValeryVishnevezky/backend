import { Hono } from 'hono'
import { addProduct, deleteProduct, getProduct, getProducts, updateProduct } from './products-controller'
import { requireAdmin } from '../../middlewares/middlewares'

const products = new Hono()

products.get('/', getProducts)
products.get('/:id', getProduct)
products.delete('/:id', requireAdmin, deleteProduct)
products.post('/', requireAdmin, addProduct)
products.put('/:id', requireAdmin, updateProduct)

export default products
