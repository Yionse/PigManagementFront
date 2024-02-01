import { h, reactive } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import {
  MailOutlined,
  CalendarOutlined,
  AppstoreOutlined,
  SettingOutlined,
} from "@ant-design/icons-vue";

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
        document.title = "主页";
      },
      children: [
        {
          path: "index",
          component: () => import("@/views/Index/index.vue"),
          beforeEnter: () => {
            document.title = "主页";
          },
        },
        {
          path: "pig",
          component: () => import("@/views/Pig/index.vue"),
          beforeEnter: () => {
            document.title = "种猪管理";
          },
        },
      ],
    },
  ],
});

export const CustomMenu = reactive([
  {
    key: "index",
    label: "主页",
    icon: h(MailOutlined),
  },
  {
    key: "pig",
    label: "种猪管理",
    icon: h(CalendarOutlined),
  },
]);
