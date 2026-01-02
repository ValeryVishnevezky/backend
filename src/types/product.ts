export interface Product {
	_id: string
	name: string
	price: number
	category: string
	inStock: boolean
	createdAt: Date
}

export interface ProductFilter {
	txt?: string
	minPrice?: number
	maxPrice?: number
	category?: string
	inStock?: string
}
