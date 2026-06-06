export interface ILoginRequest {
	phone: string
	password: string
}

export interface IUser {
	id: number
	phone: string
	first_name: string | null
	last_name: string | null
	full_name?: string
	role: { id: number; code: string; name: string }
	is_verified?: boolean
	last_login?: string
	created_at: string
	updated_at: string
}

export interface ILoginResponse {
	message: string
	data: {
		id: number
		phone: string
		token: string
	}
}

export interface IProfileResponse {
	message: string
	data: IUser
}

export interface IUpdateProfileRequest {
	first_name?: string
	last_name?: string
	phone?: string
	password?: string
}
