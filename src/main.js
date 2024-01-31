import { createApp } from "vue";
import "./style.css";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import { router } from "./routes";
import AppVue from "./App.vue";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import { setGlobalOptions } from "vue-request";

setGlobalOptions({
  manual: true,
});

// 入口文件，创建整个vue实例
const app = createApp(AppVue);

// 引入字体图标
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}

// 引入vue-router
app.use(router);
// 引入ElementPlus
app.use(ElementPlus);
app.mount("#app");
