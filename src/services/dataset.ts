import request, { ResData } from '@/utils/request'

export type Dataset = {
  annotateType: string
  id: number
  name: string
  userId: number
  username: string
  version: string
}

export const getDatasetsByUser = (username: string) =>
  request.get<any, ResData<Dataset[]>>('/dataset/user?username=' + username)
