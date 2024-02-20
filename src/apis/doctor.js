// doctor.js

import { useRequest } from "vue-request";
import { post, get } from ".";

// 获取医生列表
export function getDoctorList() {
  return useRequest(async () => await get("/doctor/list"), { manual: false });
}

// 更新医生信息
export function fetchUpdateDoctor(data) {
  return post("/doctor/update", data);
}

// 删除医生
export function fetchDeleteDoctor(doctorId) {
  return post("/doctor/delete", { doctorId });
}

// 添加医生
export function fetchAddDoctor(data) {
  return post("/doctor/add", data);
}
