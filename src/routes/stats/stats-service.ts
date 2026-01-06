import { loggerService } from '../../services/logger'
import { Order } from '../../types/order'
import { StatsFilter } from '../../types/stats'
import { query } from '../orders/orders-service'

export async function getStatistics(filterBy: StatsFilter = { period: 'week' }) {
	const { currentStart, currentEnd, prevStart, prevEnd } = getPeriodDates(filterBy)
	const orders = await query({ createdAt: prevStart, sort: -1 })
	const ordersToCalculate = _makeOrdersToCalculate(orders)

	if (!ordersToCalculate.length) {
		loggerService.info('No orders found for statistics')
		return { currentPeriod: emptyStats(), prevPeriod: emptyStats() }
	}

	const { currentPeriod, prevPeriod } = getFilteredOrders(ordersToCalculate, currentStart, currentEnd, prevStart, prevEnd)

	return {
		currentPeriod: statsMap(currentPeriod, filterBy.period),
		prevPeriod: statsMap(prevPeriod, filterBy.period),
		deliveryStats: getDeliveryStats(currentPeriod)
	}
}

function getFilteredOrders(ordersToCalculate: Order[], currentStart: Date, currentEnd: Date, prevStart: Date, prevEnd: Date) {
	let currentPeriod = ordersToCalculate.filter(order => order.createdAt >= currentStart && order.createdAt <= currentEnd)
	let prevPeriod = ordersToCalculate.filter(order => order.createdAt >= prevStart && order.createdAt < prevEnd)
	return { currentPeriod, prevPeriod }
}

function statsMap(orders: Order[], period: string) {
	if (!orders.length) return emptyStats()
	const monthNames = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December']
	const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
	const names = period === 'week' ? dayNames : monthNames

	const stats = orders.reduce((map, order) => {
		const idx = period === 'week' ? order.createdAt.getUTCDay() : order.createdAt.getUTCMonth()
		const name = names[idx]

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

function getDeliveryStats(orders: Order[]) {
	const deliveryStats = orders.reduce(
		(stats, order) => {
			if (order.status === 'pending') {
				stats.Pending++
			} else if (order.status === 'processing') {
				stats.Processing++
			} else if (order.status === 'delivered') {
				stats.Delivered++
			} else if (order.status === 'cancelled') {
				stats.Cancelled++
			}
			return stats
		},
		{ Pending: 0, Processing: 0, Delivered: 0, Cancelled: 0 }
	)
	return deliveryStats
}

function emptyStats() {
	return {
		empty: {
			totalRevenue: 0,
			totalOrders: 0,
			averageOrderValue: 0,
			totalProductsSold: 0
		}
	}
}

function getPeriodDates(filterBy: StatsFilter) {
	const now = new Date()
	let currentStart = new Date(now.getTime())
	let prevStart = new Date(now.getTime())
	let prevEnd = new Date(now.getTime())

	switch (filterBy.period) {
		case 'week':
			currentStart.setUTCDate(currentStart.getUTCDate() - 7)
			prevStart.setUTCDate(prevStart.getUTCDate() - 14)
			prevEnd.setUTCDate(prevEnd.getUTCDate() - 7)
			break
		case '3months':
			currentStart.setMonth(now.getUTCMonth() - 3)
			prevStart.setMonth(now.getUTCMonth() - 6)
			prevEnd.setMonth(now.getUTCMonth() - 3)
			break
		case 'year':
			currentStart.setFullYear(now.getFullYear() - 1)
			prevStart.setFullYear(now.getFullYear() - 2)
			prevEnd.setFullYear(now.getFullYear() - 1)
			break
	}

	return { currentStart, currentEnd: now, prevStart, prevEnd }
}

function _makeOrdersToCalculate(orders: any[]): Order[] {
	return orders.map(order => {
		return {
			...order,
			createdAt: order.createdAt ? new Date(order.createdAt) : null
		}
	})
}
