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
  title.value = CustomMenu.find((item) => item.key === e.key).label;
};

onMounted(() => {
  const currentStateArray = location.pathname.split("/");
  const currentState = CustomMenu.find(
    (item) => item.key === currentStateArray[currentStateArray.length - 1]
  );
  state.selectedKeys = [currentState.key];
  state.openKeys = [currentState.key];
  title.value = currentState.label;
});
</script>

<template>
  <div :style="{ height: '100vh' }" class="flex flex-row flex-nowrap">
    <Menu
      v-model:openKeys="state.openKeys"
      v-model:selectedKeys="state.selectedKeys"
      :style="{ width: '20%', height: '100%', position: 'fixed', top: '0px' }"
      :mode="state.mode"
      :items="CustomMenu"
      theme="dark"
      @click="itemHandle"
    ></Menu>
    <div class="w-4/5" style="margin-left: 20%">
      <Card class="m-4 font-bold text-2xl">
        {{ title }}
      </Card>
      <RouterView></RouterView>
    </div>
  </div>
</template>

<style lang="less"></style>
