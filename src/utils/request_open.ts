// 请求公有云API的axios解决跨域
import { message } from 'antd'
import axios from 'axios'

export type ResData<T> = {
  code: number
  data: T
  msg: string
}

//创建axios实例
const request = axios.create({
  // 设置baseURL
  baseURL: import.meta.env.VITE_APP_BASE_API_PRI
})

//请求拦截器
request.interceptors.request.use((config) => {
  // 配置header为access_token
  return config
})

//响应拦截器
request.interceptors.response.use(
  async (response) => response.data,
  (error) => {
    console.log(error)
    //处理网络错误
    message.error(error.message)
    return Promise.reject(error)
  }
)

export default request
