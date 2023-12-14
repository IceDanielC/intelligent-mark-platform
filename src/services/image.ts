import request, { type ResData } from '@/utils/request'

export type DatasetImage = {
  datasetId: number
  id: number
  isAnnotate: string
  isValidated: string
  name: string
  url: string
}

// 图片是否标注
export const isImageAnnotate = (imageUrl: string) =>
  request.get<any, ResData<boolean>>('/image/isAnnotated?imageUrl=' + imageUrl)

// 是否为有效数据
export const isValidated = (imageUrl: string) =>
  request.get<any, ResData<boolean>>('/image/isValidated?imageUrl=' + imageUrl)

//通过数据集获取images
export const imagesFromDataset = (datasetName: string, version: string) =>
  request.get<any, ResData<DatasetImage[]>>(
    `/dataset/images/${datasetName}/${version}`
  )

// 获取已标记images
export const annotatedImagesFromDataset = (
  datasetName: string,
  version: string
) =>
  request.get<any, ResData<DatasetImage[]>>(
    `/dataset/images/annotated/${datasetName}/${version}`
  )

// 获取未标记images
export const unAnnotatedImagesFromDataset = (
  datasetName: string,
  version: string
) =>
  request.get<any, ResData<DatasetImage[]>>(
    `/dataset/images/unAnnotated/${datasetName}/${version}`
  )
