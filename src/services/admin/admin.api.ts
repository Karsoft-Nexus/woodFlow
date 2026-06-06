import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { adminService } from './admin.service'
import type {
	IAdminUser, IPatchedAdminUser, IRole, IUserSalary, IPatchedUserSalary,
	IAdminUserParams, IRoleParams, IUserSalaryParams
} from './admin.types'

// ── Users ──────────────────────────────────────────────────────
export const useGetAdminUsers = (params?: IAdminUserParams) => {
	return useQuery({
		queryKey: ['admin-users', params],
		queryFn: () => adminService.getUsers(params),
	})
}

export const useGetAdminUser = (id: number) => {
	return useQuery({
		queryKey: ['admin-user', id],
		queryFn: () => adminService.getUser(id),
		enabled: !!id,
	})
}

export const useCreateAdminUser = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-admin-user'],
		mutationFn: (payload: IAdminUser) => adminService.createUser(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
		},
	})
}

export const useUpdateAdminUser = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-admin-user'],
		mutationFn: ({ id, data }: { id: number; data: IAdminUser }) =>
			adminService.updateUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
		},
	})
}

export const usePatchAdminUser = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-admin-user'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedAdminUser }) =>
			adminService.patchUser(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
		},
	})
}

export const useDeleteAdminUser = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-admin-user'],
		mutationFn: (id: number) => adminService.deleteUser(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['admin-users'] })
		},
	})
}

// ── Roles ──────────────────────────────────────────────────────
export const useGetRoles = (params?: IRoleParams) => {
	return useQuery({
		queryKey: ['roles', params],
		queryFn: () => adminService.getRoles(params),
	})
}

export const useCreateRole = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-role'],
		mutationFn: (payload: IRole) => adminService.createRole(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] })
		},
	})
}

export const useUpdateRole = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-role'],
		mutationFn: ({ id, data }: { id: number; data: IRole }) =>
			adminService.updateRole(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] })
		},
	})
}

export const useDeleteRole = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-role'],
		mutationFn: (id: number) => adminService.deleteRole(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['roles'] })
		},
	})
}

// ── User Salaries ───────────────────────────────────────────────
export const useGetUserSalaries = (params?: IUserSalaryParams) => {
	return useQuery({
		queryKey: ['user-salaries', params],
		queryFn: () => adminService.getUserSalaries(params),
	})
}

export const useCreateUserSalary = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['create-user-salary'],
		mutationFn: (payload: IUserSalary) => adminService.createUserSalary(payload),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-salaries'] })
		},
	})
}

export const useUpdateUserSalary = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['update-user-salary'],
		mutationFn: ({ id, data }: { id: number; data: IUserSalary }) =>
			adminService.updateUserSalary(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-salaries'] })
		},
	})
}

export const usePatchUserSalary = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['patch-user-salary'],
		mutationFn: ({ id, data }: { id: number; data: IPatchedUserSalary }) =>
			adminService.patchUserSalary(id, data),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-salaries'] })
		},
	})
}

export const useDeleteUserSalary = () => {
	const queryClient = useQueryClient()
	return useMutation({
		mutationKey: ['delete-user-salary'],
		mutationFn: (id: number) => adminService.deleteUserSalary(id),
		onSuccess: () => {
			queryClient.invalidateQueries({ queryKey: ['user-salaries'] })
		},
	})
}