import request from '@/utils/request_open'

export type Location = {
  height: number
  left: number
  top: number
  width: number
}

export type LabelInfo = {
  location: Location
  name: string
  score: number
  color?: string
}

type OpenAPIRes = {
  log_id: number
  results: LabelInfo[]
}

// 百度云API
export const detectImageUseOnlineModal = (url: string) =>
  request.post<any, OpenAPIRes>(
    '/zw_disease?input_type=url&access_token=24.0cb95b0c4995e4f99591e963ba77f8d2.2592000.1705136870.282335-44973375',
    { url, threshold: 0.4 }
  )
