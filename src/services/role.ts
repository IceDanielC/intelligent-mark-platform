import request, { type ResData } from '@/utils/request'

export type Role = {
  id: number
  role: string
  menuList: string[]
}

export const getRoleList = () => request.get<any, ResData<Role[]>>('/role/list')

export const updateRole = (role: Role) =>
  request.post<any, ResData<null>>('/role/update', role)
