import request, { ResData } from '@/utils/request'

export type UserLabelItem = {
  id: number
  groupId: number
  name: string
  color: string
}

export type UserLabelItemPage = {
  current: number
  orders: []
  pages: number
  records: UserLabelItem[]
  searchCount: boolean
  size: number
  total: number
}

export const getUserLabelItmeList = (
  groupId: number,
  current = 1,
  size = 5,
  nameKeyword = ''
) =>
  request.get<any, ResData<UserLabelItemPage>>(
    `/userLabelItem/list/${groupId}?current=${current}&size=${size}&nameKeyword=${nameKeyword}`
  )

export const updateItemList = (userLabelItem: UserLabelItem) =>
  request.post('/userLabelItem/update', userLabelItem)

export const deleteItem = (id: number) => request.delete(`/userLabelItem/${id}`)

export const deleteItemList = (idList: number[]) =>
  request.post('/userLabelItem/batch', idList)
