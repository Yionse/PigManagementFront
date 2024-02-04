import axios from "axios";
import { ElMessage } from "element-plus";

// 封装一个实例，以供通用
const httpInstance = axios.create({
  // 通过环境变量的方式，引入基地址和端口号
  // baseURL: `${import.meta.env.VITE_BASE_URL}:${import.meta.env.VITE_BASE_PORT}`,
  // 设置请求超时时间
  timeout: 5000,
  // 可以设置一些请求信息
  // headers: {
  //   "Authorization": ""
  // }
});

// 配置请求拦截器
httpInstance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 配置响应拦截器
httpInstance.interceptors.response.use(
  (result) => {
    if (result.data.code === 500) {
      ElMessage.error(result.data.message);
    }
    return result.data.result;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// 导出两个常用的get和post方法，并定义自定义泛型，以在返回数据时，更好的使用
export function get(url, data) {
  return httpInstance.get(`/api${url}`, data);
}

export function post(url, data) {
  return httpInstance.post(`/api${url}`, data);
}
