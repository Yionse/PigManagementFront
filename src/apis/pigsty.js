import { useRequest } from "vue-request";
import { get, post } from ".";

export function getPigstyList() {
  return useRequest(async () => await get("/pigsty/list"), { manual: false });
}

export function fetchDeletePigsty(data) {
  return post("/pigsty/del", data);
}
export function fetchUpdatePigsty(data) {
  return post("/pigsty/update", data);
}

export function fetchAddPigsty(data) {
  return post("/pigsty/add", data);
}
