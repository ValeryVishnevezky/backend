import { Hono } from 'hono'
import { getStats } from './stats-controller'
import { requireAdmin, requireAuth } from '../../middlewares/middlewares'

const stats = new Hono()

stats.get('/', requireAuth, requireAdmin, getStats)

export default stats
