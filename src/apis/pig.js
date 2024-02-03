import { post, get } from ".";
import { useRequest } from "vue-request";

export function getPigList() {
  return useRequest(async () => await get("/pig/list"), { manual: false });
}
