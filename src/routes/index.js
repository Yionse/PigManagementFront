import { createRouter, createWebHistory } from "vue-router";

export const router = createRouter({
  history: createWebHistory(),
  routes: [
    {
      path: "/",
      component: () => import("@/views/Login/index.vue"),
      beforeEnter: () => {
        document.title = "登录";
      },
    },
    {
      path: "/home",
      component: () => import("@/views/Home/index.vue"),
      beforeEnter: () => {
        document.title = "登录";
      },
    },
  ],
});
