import request, { type ResData } from '@/utils/request'

export type Model = {
  id: number
  modelName: string
  modelApi: string
}

export const getModels = () => request.get<any, ResData<Model[]>>(`/model/list`)
