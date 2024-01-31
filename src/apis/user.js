import { post } from ".";

// 定义登录接口
export async function fetchLogin(data) {
  return post("/user/login", data);
}
