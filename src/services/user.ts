import request, { type ResData } from '@/utils/request'

export type DoubleToken = {
  accessToken: string
  freshToken: string
  username?: string
}

export const loginService = (username: string, password: string) =>
  request.post<any, ResData<DoubleToken>>('/admin/login', {
    username,
    password
  })

// freshToken实现无感刷新
export const tokenFreshService = (freshToken: string) =>
  request.post<any, ResData<DoubleToken>>(`/admin/refresh?token=${freshToken}`)
