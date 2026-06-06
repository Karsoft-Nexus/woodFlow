export interface ICustomer {
	id: number
	first_name: string
	last_name?: string
	phone: string
	address?: string
	created_at: string
}

export type ICustomerCreate = Omit<ICustomer, 'id' | 'created_at'>

export interface IOrder {
	id: number
	customer_detail: ICustomer
	source: 'TELEGRAM' | 'INSTAGRAM' | 'PHONE' | 'OFFICE'
	product_type: 'KITCHEN' | 'SHKAF' | 'SPALNIY' | 'OFFICE' | 'OTHER'
	status: string
	zamer_dimensions?: string | null
	zamer_photos_url?: string | null
	design_3d_url?: string | null
	contract_number?: string | null
	is_contract_signed: boolean
	signed_at?: string | null
	total_price: string
	advance_payment: string
	deadline?: string | null
	customer: number
	zamerchik?: number | null
	designer?: number | null
	payment_method?: 'CASH' | 'CARD' | 'BANK_TRANSFER' | null
	created_at: string
}

export type IOrderCreate = {
	customer: number
	source: 'TELEGRAM' | 'INSTAGRAM' | 'PHONE' | 'OFFICE'
	product_type: 'KITCHEN' | 'SHKAF' | 'SPALNIY' | 'OFFICE' | 'OTHER'
	total_price: string
	advance_payment: string
	deadline?: string
}

export type IOrderPatch = Partial<IOrder>

export interface IOrderParams {
	page?: number
	limit?: number
	search?: string
	status?: string
	ordering?: string
}

export interface ISignContractPayload {
	total_price: string
	advance_payment: string
	payment_method: 'CASH' | 'CARD' | 'BANK_TRANSFER'
}
