import { Context } from 'hono'
import { getStatistics } from './stats-service'

export async function getStats(c: Context) {
	const filter = c.req.query()
	const filterBy = { period: filter.period || 'week' }
	const stats = await getStatistics(filterBy)
	console.log('stats', stats)
	return c.json(stats)
}
