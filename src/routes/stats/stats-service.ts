import { loggerService } from '../../services/logger'
import { Order } from '../../types/order'
import { query } from '../orders/orders-service'

export async function getStatistics() {
	const orders = await query()
	const ordersToCalculate = _makeOrdersToCalculate(orders)

	if (!ordersToCalculate.length) {
		loggerService.info('No orders found for statistics')
		return {
			allTimeStats: emptyStats(),
			lastMonthStats: emptyStats()
		}
	}

	const perMonthStats = calculateStats(ordersToCalculate, 'year')
	const lastWeekStats = calculateStats(ordersToCalculate, 'week')
	// const allStats = calculateStats(ordersToCalculate, 'all')
	return { perMonthStats, lastWeekStats }
}

function calculateStats(orders: Order[], period: string) {
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	let names: string[] = []
	const date = new Date()

	if (period === 'year') {
		date.setDate(date.getDate() - 365)
		names = monthNames
	} else if (period === 'week') {
		date.setDate(date.getDate() - 7)
		names = dayNames
	}

	const ordersToCalculate = orders.filter(order => (order.createdAt ? order.createdAt > date : false))

	if (!ordersToCalculate.length) {
		loggerService.info('No orders found for statistics')
		return emptyStats()
	}

	return statsMap(ordersToCalculate, names, period)
}

function statsMap(orders: Order[], names: string[], period: string) {
	const stats = orders.reduce((map, order) => {
		let name: string = ''

		if (period === 'year') {
			const idx = order.createdAt ? order.createdAt.getMonth() : 0
			name = names[idx]
		} else if (period === 'week') {
			const idx = order.createdAt ? order.createdAt.getDay() : 0
			name = names[idx]
		}

		if (!map[name]) map[name] = { totalRevenue: 0, totalOrders: 0, totalProductsSold: 0, averageOrderValue: 0 }
		map[name].totalRevenue += order.totalPrice
		map[name].totalOrders++
		map[name].totalProductsSold += order.quantity

		return map
	}, {} as { [key: string]: { totalRevenue: number; totalOrders: number; totalProductsSold: number; averageOrderValue: number } })

	for (const name in stats) {
		stats[name].averageOrderValue = stats[name].totalRevenue / stats[name].totalOrders
	}

	return stats
}

function emptyStats() {
	return {
		totalRevenue: 0,
		totalOrders: 0,
		averageOrderValue: 0,
		totalProductsSold: 0
	}
}

function _makeOrdersToCalculate(orders: any[]): Order[] {
	return orders.map(order => {
		return {
			...order,
			createdAt: order.createdAt ? new Date(order.createdAt) : null
		}
	})
}
