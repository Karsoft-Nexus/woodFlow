import { $authHost, $host } from '@/api'
import type { ILoginRequest, ILoginResponse, IProfileResponse, IUpdateProfileRequest } from './auth.types'

export const authService = {
	async login(payload: ILoginRequest): Promise<ILoginResponse> {
		const { data } = await $host.post<ILoginResponse>('/login', payload)
		return data
	},

	async getProfile(): Promise<IProfileResponse> {
		const { data } = await $authHost.get<IProfileResponse>('/admins/profile')
		return data
	},

	async updateProfile(payload: IUpdateProfileRequest): Promise<IProfileResponse> {
		const { data } = await $authHost.patch<IProfileResponse>('/admins/profile', payload)
		return data
	},

	async changePassword(payload: { old_password: string; new_password: string }): Promise<{ message: string }> {
		const { data } = await $authHost.post<{ message: string }>('/admins/change-password', payload)
		return data
	},
}
