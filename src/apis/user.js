import { post } from ".";

// 定义登录接口
export async function fetchLogin(data) {
  return post("/user/login", data);
}

// 定义注册接口
export async function fetchRegister(data) {
  return post("/user/register", data);
}
