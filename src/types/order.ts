export interface Order {
	_id: string
	product: object
	customer: object
	status: string
	quantity: number
	totalPrice: number
}

export interface OrderFilter {
	productId?: string
	category?: string
	customerId?: string
	status?: string
	quantity?: number
	totalMinPrice?: number
	totalMaxPrice?: number
}
