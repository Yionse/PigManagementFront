// doctor.js

import { useRequest } from "vue-request";
import { post, get } from ".";

export function getHealthList() {
  return useRequest(async () => await get("/health/list"), { manual: false });
}

export function fetchUpdateHealth(data) {
  return post("/health/update", data);
}

export function fetchDeleteHealth(doctorIds) {
  return post("/health/delete", { ids: doctorIds });
}

export function fetchAddHealth(data) {
  return post("/health/add", data);
}
