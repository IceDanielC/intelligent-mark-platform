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

export const getLabelsByImage = (imageUrl: string) =>
  request.get<any, ResData<LabelInfoSelf[]>>(
    '/labelInfo/imageLabels?imageUrl=' + imageUrl
  )

// 保存每个id图片的所有标签
export const saveLabelByImage = (imageId: number, labels: LabelInfoSelf[]) =>
  request.post<any, ResData<any>>('/labelInfo/save?imageId=' + imageId, labels)
