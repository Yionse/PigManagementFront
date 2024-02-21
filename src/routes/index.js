import { h, reactive } from "vue";
import { createRouter, createWebHistory } from "vue-router";
import {
  PieChartOutlined,
  CalendarOutlined,
  OrderedListOutlined,
  PrinterOutlined,
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
        {
          path: "breedType",
          component: () => import("@/views/BreedType/index.vue"),
          beforeEnter: () => {
            document.title = "品种管理";
          },
        },
        {
          path: "pigsty",
          component: () => import("@/views/Pigsty/index.vue"),
          beforeEnter: () => {
            document.title = "猪舍管理";
          },
        },
        {
          path: "doctor",
          component: () => import("@/views/Doctor/index.vue"),
          beforeEnter: () => {
            document.title = "医生管理";
          },
        },
        {
          path: "entryRecord",
          component: () => import("@/views/EntryRecord/index.vue"),
          beforeEnter: () => {
            document.title = "入栏记录";
          },
        },
        {
          path: "exitRecord",
          component: () => import("@/views/ExitRecord/index.vue"),
          beforeEnter: () => {
            document.title = "出栏记录";
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
    icon: h(PieChartOutlined),
  },
  {
    key: "pig",
    label: "种猪管理",
    icon: h(CalendarOutlined),
  },
  {
    key: "breedType",
    label: "品种管理",
    icon: h(OrderedListOutlined),
  },
  {
    key: "pigsty",
    label: "猪舍管理",
    icon: h(PrinterOutlined),
  },
  {
    key: "doctor",
    label: "医生管理",
    icon: h(PrinterOutlined),
  },
  {
    key: "entryRecord",
    label: "入栏管理",
    icon: h(PrinterOutlined),
  },
  {
    key: "exitRecord",
    label: "出栏管理",
    icon: h(PrinterOutlined),
  },
]);
