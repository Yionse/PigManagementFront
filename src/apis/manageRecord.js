import { useRequest } from "vue-request";
import { get } from ".";

export function getEntryRecordList() {
  return useRequest(async () => await get("/entry/list"), { manual: false });
}

export function getExitRecordList() {
  return useRequest(async () => await get("/exit/list"), { manual: false });
}
