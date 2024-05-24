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

const ACCESS_TOKEN =
  '24.29ffab8aea07709a897470ee6e8d66fb.2592000.1716730096.282335-44973375'

// 重新获取云检测API等access_token避免过期
export const getAccessToken = () =>
  request.post(
    'https://aip.baidubce.com/oauth/2.0/token?grant_type=client_credentials&client_id=gTPUiooGN5zqexjNNNFK4znx&client_secret=yIOgFi9rpz7fUUVdfwjZ6BLX6zQOIAcU'
  )

// 百度云API
export const detectImageUseOnlineModal = (url: string, apiPath: string) =>
  request.post<any, OpenAPIRes>(
    `${apiPath}?input_type=url&access_token=${ACCESS_TOKEN}`,
    { url, threshold: 0.7 }
  )
