import request, { ResData } from '@/utils/request'

export type Dataset = {
  annotateType: string
  id: number
  name: string
  userId: number
  username: string
  version: string
  imgNumber: number
  annotatedNumber: number
  module: string
  savePlace: string
}

export type DatasetPage = {
  current: number
  orders: []
  pages: number
  records: Dataset[]
  searchCount: boolean
  size: number
  total: number
}

export const getDatasetsByUser = (username: string) =>
  request.get<any, ResData<Dataset[]>>('/dataset/user?username=' + username)

// 分页获取所有数据集
export const getDatasetPagesByUser = (
  username: string,
  current = 1,
  size = 4,
  nameKeyword = ''
) =>
  request.get<any, ResData<DatasetPage>>(
    `/dataset/user/page?username=${username}&current=${current}&size=${size}&nameKeyword=${nameKeyword}`
  )

// 新增数据集
export const createDataset = (dataset: Dataset) =>
  request.post<any, ResData<boolean>>('/dataset/create', dataset)
