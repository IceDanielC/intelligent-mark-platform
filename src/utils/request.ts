// axios二次封装，请求和响应拦截器
import { ACCESS_TOKEN, FRESH_TOKEN } from "@/pages/login/Login";
import { message } from "antd";
import axios from "axios";
import NProgress from "nprogress";
import "nprogress/nprogress.css"; // 导入样式，否则看不到效果
NProgress.configure({ showSpinner: false }); // 显示右上角螺旋加载提示
import router from "@/router";
import { tokenFreshService } from "@/services/user";

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
  NProgress.start();
  // 配置header为access_token
  config.headers.Authorization = localStorage.getItem(ACCESS_TOKEN) ?? "";
  return config;
});

//响应拦截器
request.interceptors.response.use(
  async (response) => {
    // 关闭进度条
    NProgress.done();
    if (response.data.code === 200) return response.data;
    else if (
      response.data.code === 401 &&
      !response.config.url?.includes("/admin/refresh")
    ) {
      const { data } = await tokenFreshService(
        localStorage.getItem(FRESH_TOKEN) as string
      );
      localStorage.setItem(ACCESS_TOKEN, data.accessToken);
      localStorage.setItem(FRESH_TOKEN, data.freshToken);
      // 重发请求
      return request(response.config);
    } else if (response.data.code === 401) {
      // freshToken也过期了
      router.navigate("/");
      message.error("身份验证已失效，请重新登陆");
    } else {
      message.error(response.data.code + ": " + response.data.msg);
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
        msg = "未授权";
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
        msg = "其他错误...";
    }
    message.error(msg);
    return Promise.reject(error);
  }
);

export default request;
