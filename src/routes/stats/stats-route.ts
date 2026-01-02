import { Hono } from 'hono'
import { getStats } from './stats-controller'
import { requireAdmin } from '../../middlewares/middlewares'

const stats = new Hono()

stats.get('/', requireAdmin, getStats)

export default stats
