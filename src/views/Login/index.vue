<script setup>
import { ref } from "vue";
import Login from "@/views/Login/components/Login.vue";
import Register from "@/views/Login/components/Register.vue";
const tabKey = ref("login");
</script>

<template>
  <div class="box relative">
    <div
      class="model w-2/5 absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-md px-7"
    >
      <h2 class="text-center text-4xl mt-4 font-bold">
        猪场繁殖与育种管理系统
      </h2>
      <el-tabs v-model="tabKey" class="demo-tabs mt-4">
        <el-tab-pane label="登录" name="login"><Login /> </el-tab-pane>
        <el-tab-pane label="注册" name="register"><Register /></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<style lang="less">
.box {
  width: 100vw;
  height: 100vh;
  background: url("../../assets/back2.jpg");
  background-size: 100% 100%;
  .model {
    background: rgba(0, 0, 0, 0.4);
    h2 {
      color: white;
      letter-spacing: 8px;
    }
  }
  .el-form-item__label,
  .el-tabs__item.is-active {
    color: white;
    font-size: 18px;
    transition: all 0.3s linear;
  }
}
</style>
