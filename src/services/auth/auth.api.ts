import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { authService } from './auth.service'
import type { ILoginRequest, IUpdateProfileRequest } from './auth.types'

export const useLogin = () => {
	const queryClient = useQueryClient()

	return useMutation({
		mutationKey: ['login'],
		mutationFn: (payload: ILoginRequest) => authService.login(payload),
		onSuccess: (response) => {
			localStorage.setItem('token', response.data.token)
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		},
	})
}

export const useGetProfile = () => {
	return useQuery({
		queryKey: ['profile'],
		queryFn: () => authService.getProfile(),
		retry: false,
		enabled: !!localStorage.getItem('token'),
	})
}

export const useUpdateProfile = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-profile'],
		mutationFn: (payload: IUpdateProfileRequest) => authService.updateProfile(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['profile'] })
		},
	})
}

export const useChangePassword = () => {
	return useMutation({
		mutationKey: ['change-password'],
		mutationFn: (payload: { old_password: string; new_password: string }) =>
			authService.changePassword(payload),
	})
}

export const useLogout = () => {
	const queryClient = useQueryClient()

	return () => {
		localStorage.removeItem('token')
		queryClient.setQueryData(['profile'], null)
		queryClient.clear()
	}
}
