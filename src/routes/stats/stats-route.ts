import { Hono } from 'hono'
import { loggerService } from '../../services/logger'
import { getStats } from './stats-controller'
import { requireAdmin } from '../../middlewares/middlewares'

const stats = new Hono()

stats.get('/test', c => {
	loggerService.info('Stats route accessed')
	return c.json({ message: 'Stats route is working' })
})

stats.get('/', requireAdmin, getStats)

export default stats
