import { post, get } from ".";
import { useRequest } from "vue-request";

export function getPigList() {
  return useRequest(async () => await get("/pig/list"), { manual: false });
}

export function getBreed() {
  return useRequest(async () => await get("/pig/breed"), { manual: false });
}

export function fetchUpdatePig(data) {
  return post("/pig/update", data);
}

export function fetchAddPig(data) {
  return post("/pig/add", data);
}

export function fetchExitPigsty(data) {
  return post("/pigsty/exit", data);
}

export function fetchDeleteBreedType(data) {
  return post("/pig/breedDel", data);
}

export function fetchAddBreedType(data) {
  return post("/pig/breedAdd", data);
}
