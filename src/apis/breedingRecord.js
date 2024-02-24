// doctor.js

import { useRequest } from "vue-request";
import { post, get } from ".";

// 获取繁殖记录列表
export function getBreedingList() {
  return useRequest(async () => await get("/breeding/list"), { manual: false });
}

// 更新繁殖记录信息
export function fetchUpdateBreeding(data) {
  return post("/breeding/update", data);
}

// 删除繁殖记录
export function fetchDeleteBreeding(recordId) {
  return post("/breeding/delete", { recordId });
}

// 添加繁殖记录
export function fetchAddBreeding(data) {
  return post("/breeding/add", data);
}
