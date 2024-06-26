import request, { ResData } from '@/utils/request'

export type LabelInfoSelf = {
  id: number
  imageId: number
  labelName: string
  topPx: number
  leftPx: number
  heightPx: number
  widthPx: number
  color?: string
}

export type DatasetLabel = {
  color: string
  datasetId?: number
  id?: number
  name: string
}

export type YOLOLabel = {
  labelIndex: number
  x: number
  y: number
  width: number
  height: number
}

export const getLabelsByImage = (
  imageUrl: string,
  datasetName: string,
  version: string
) =>
  request.get<any, ResData<LabelInfoSelf[]>>(
    `/labelInfo/imageLabels?imageUrl=${imageUrl}&username=${localStorage.getItem(
      'user/info'
    )}&datasetName=${datasetName}&version=${version}`
  )

// 保存每个id图片的所有标签
export const saveLabelByImage = (imageId: number, labels: LabelInfoSelf[]) =>
  request.post<any, ResData<any>>('/labelInfo/save?imageId=' + imageId, labels)

// 获取对于数据集的保存的所有labels
export const getDatasetLabels = (
  username: string,
  datasetName: string,
  version: string
) =>
  request.get<any, ResData<DatasetLabel[]>>(
    `/labelGroup/dataset/${username}/${datasetName}/${version}`
  )

// 导出图片中的所有标签（YOLO格式）
export const downloadLabelYOLO = (labels: YOLOLabel[]) =>
  request.post('/labelInfo/download/yolo', labels)

// 新增标签
export const addLabelGroup = (
  username: string,
  datasetName: string,
  version: string,
  labelFormData: DatasetLabel
) =>
  request.post<any, ResData<string | null>>(
    `/labelGroup/add/${username}/${datasetName}/${version}`,
    labelFormData
  )

// 删除标签
export const deleteDatasetLabel = (labelId: number) =>
  request.delete(`/labelGroup/delete/${labelId}`)
