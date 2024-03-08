import request, { type ResData } from '@/utils/request'

export type Role = {
  id: number
  role: string
  menuList: string[]
}

export type Menu = {
  id: number
  name: string
  description: string
}

export const getRoleList = () => request.get<any, ResData<Role[]>>('/role/list')

export const updateRole = (role: Role) =>
  request.post<any, ResData<null>>('/role/update', role)

export const getMenuList = () =>
  request.get<any, ResData<Menu[]>>('/menu/list').then((res) => res.data)

// 获取权限菜单
export const getRoleMenus = (username: string) =>
  request.get<any, ResData<string>>(`/role/menus/${username}`)
