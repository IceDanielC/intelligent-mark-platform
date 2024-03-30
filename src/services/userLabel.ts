import request, { ResData } from '@/utils/request'

export type UserLabel = {
  id: number
  userId: number
  groupName: string
  description: string
  createTime: string
  username?: string
}

export type UserLabelPage = {
  current: number
  orders: []
  pages: number
  records: UserLabel[]
  searchCount: boolean
  size: number
  total: number
}

export const getUserLabelList = (
  username: string,
  current = 1,
  size = 5,
  nameKeyword = ''
) =>
  request.get<any, ResData<UserLabelPage>>(
    `/userLabel/list?username=${username}&current=${current}&size=${size}&nameKeyword=${nameKeyword}`
  )

export const updateUserLabel = (userLabel: UserLabel) =>
  request.post(`/userLabel/update`, userLabel)

export const deleteUserLabel = (userId: number) =>
  request.delete(`/userLabel/${userId}`)

export const getListByUsername = (username: string) =>
  request.get<any, ResData<UserLabel[]>>(`/userLabel/${username}/labelGroup`)
