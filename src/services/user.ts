import request, { type ResData } from '@/utils/request'

export type DoubleToken = {
  accessToken: string
  freshToken: string
  username?: string
}

export type User = {
  id: number | string
  username: string
  password: string
  role: string
}

export const loginService = (username: string, password: string) =>
  request.post<any, ResData<DoubleToken>>('/admin/login', {
    username,
    password
  })

// freshToken实现无感刷新
export const tokenFreshService = (freshToken: string) =>
  request.post<any, ResData<DoubleToken>>(`/admin/refresh?token=${freshToken}`)

export const getAllUsers = (username = '') =>
  request.get<any, ResData<User[]>>('/admin/userList?username=' + username)

export const updateUsers = (user: User) =>
  request.post<any, ResData<null>>('/admin/update/user', user)

export const deleteUser = (id: number) =>
  request.delete<any, ResData<string | null>>('/admin/user/' + id)
