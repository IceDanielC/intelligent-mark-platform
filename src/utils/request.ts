// axios二次封装，请求和响应拦截器
import { message } from "antd";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // 导入样式，否则看不到效果
NProgress.configure({ showSpinner: false }); // 显示右上角螺旋加载提示

export type ResData<T> = {
  code: number;
  data: T;
  msg: string;
};

//创建axios实例
const request = axios.create({
  // 设置baseURL
  baseURL: import.meta.env.VITE_APP_BASE_API,
});

//请求拦截器
request.interceptors.request.use((config) => {
  //开启进度条
  NProgress.start();
  // 配置header
  // config.headers.token = JSON.parse(localStorage.getItem('userStore') as string)?.token
  // console.log(config.headers.token)
  return config;
});

//响应拦截器
request.interceptors.response.use(
  async (response) => {
    // 关闭进度条
    NProgress.done();
    if (response.data.code === 200) return response.data;
    else {
      message.error(response.data.message);
    }
    // 不要忘了返回结果
    return response.data;
  },
  (error) => {
    console.log(error);
    //处理网络错误
    let msg = "";
    const status = error.response.status;
    switch (status) {
      case 401:
        msg = "用户信息已失效，请重新登录";
        break;
      case 403:
        msg = "无权访问";
        break;
      case 404:
        msg = "请求地址错误";
        break;
      case 500:
        msg = "服务器出现问题";
        break;
      default:
        msg = "无网络...";
    }
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
