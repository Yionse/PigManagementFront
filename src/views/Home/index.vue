<script setup>
import { reactive, ref, onMounted } from "vue";
import { Menu, Card } from "ant-design-vue";
import { CustomMenu } from "@/routes";
import { useRouter } from "vue-router";

const state = reactive({
  mode: "inline",
  theme: "light",
  selectedKeys: ["index"],
  openKeys: ["index"],
});

const title = ref("");

const router = useRouter();

const itemHandle = (e) => {
  router.push(`/home/${e.key}`);
  // title.value = CustomMenu.find((item) => item.key === e.key)
};
</script>

<template>
  <div :style="{ height: '100vh' }" class="flex flex-row flex-nowrap">
    <Menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      :style="{ width: '256px', height: '100%' }"
      :mode="state.mode"
      :items="CustomMenu"
      theme="dark"
      @click="itemHandle"
    ></Menu>
    <div class="flex-grow">
      <Card class="w-full"></Card>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="less"></style>
