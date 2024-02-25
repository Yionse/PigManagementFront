// doctor.js

import { useRequest } from "vue-request";
import { post } from ".";

// 获取繁殖记录列表
export function getBreedingsList() {
  return useRequest(
    async (data) => {
      console.log(data);
      return await post("/breedings/list", data);
    },
    {
      manual: false,
    }
  );
}

// 更新繁殖记录信息
export function fetchUpdateBreedings(data) {
  return post("/breedings/update", data);
}

// 删除繁殖记录
export function fetchDeleteBreedings(recordId) {
  return post("/breedings/delete", { recordId });
}

// 添加繁殖记录
export function fetchAddBreedings(data) {
  return post("/breedings/add", data);
}
