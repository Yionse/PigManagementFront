// 从外部引入所需的函数和库
import { post, get } from ".";
import { useRequest } from "vue-request";

// 获取猪列表的函数
export function getPigList() {
  // 使用useRequest钩子异步获取猪列表数据，manual设为false表示自动触发请求
  return useRequest(async () => await get("/pig/list"), { manual: false });
}

// 获取猪品种列表的函数
export function getBreed() {
  // 使用useRequest钩子异步获取猪品种列表数据，manual设为false表示自动触发请求
  return useRequest(async () => await get("/pig/breed"), { manual: false });
}

// 更新猪信息的函数
export function fetchUpdatePig(data) {
  // 使用post方法向后端发送更新猪信息的请求
  return post("/pig/update", data);
}

// 添加猪的函数
export function fetchAddPig(data) {
  // 使用post方法向后端发送添加猪的请求
  return post("/pig/add", data);
}

// 离开猪舍的函数
export function fetchExitPigsty(data) {
  // 使用post方法向后端发送离开猪舍的请求
  return post("/pigsty/exit", data);
}

// 删除猪品种类型的函数
export function fetchDeleteBreedType(data) {
  // 使用post方法向后端发送删除猪品种类型的请求
  return post("/pig/breedDel", data);
}

// 添加猪品种类型的函数
export function fetchAddBreedType(data) {
  // 使用post方法向后端发送添加猪品种类型的请求
  return post("/pig/breedAdd", data);
}
