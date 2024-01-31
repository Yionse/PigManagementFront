<script setup>
import { reactive, ref } from "vue";
import { ElMessage } from "element-plus";
import { useRequest } from "vue-request";
import { fetchLogin } from "../../../apis/user";

const { loading, run } = useRequest(fetchLogin, { manual: true });

//  引入Form实例
const ruleFormRef = ref();
const formLabelAlign = reactive({
  username: "",
  password: "",
});

// 验证规则
const rules = {
  username: {
    required: true,
    message: "请输入用户名",
    trigger: "blur",
  },
  password: [
    {
      required: true,
      message: "请输入密码",
    },
    {
      min: 6,
      message: "密码最短为6位",
    },
    {
      max: 16,
      message: "密码最长为16位",
    },
  ],
};

// 点击了登录按钮的回调
const submitForm = async (formEl) => {
  if (!formEl) return;
  formEl.validate(async (valid) => {
    // 点击时需要再次验证表单是否达到要求
    if (!valid) {
      ElMessage({
        type: "error",
        message: "输入信息有误",
      });
      return false;
    } else {
      // 则代表通过，可以向后端发起注册请求
      const res = await run({
        username: formLabelAlign.username,
        password: formLabelAlign.password,
      });
      console.log(res, 123123);
    }
  });
};
</script>

<template>
  <el-form
    ref="ruleFormRef"
    class="mx-auto my-7"
    label-position="left"
    label-width="100px"
    :model="formLabelAlign"
    :rules="rules"
  >
    <el-form-item label="账户：" prop="username">
      <el-input
        v-model="formLabelAlign.username"
        placeholder="请输入账号或用户名"
      >
        <template #prepend>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="password">
      <el-input
        type="password"
        v-model="formLabelAlign.password"
        placeholder="请输入密码"
      >
        <template #prepend>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-button
      type="primary"
      class="w-full mt-8"
      @click="submitForm(ruleFormRef)"
      :loading="loading"
      >登录</el-button
    >
  </el-form>
</template>

<style lang="less">
.model {
  background: rgba(0, 0, 0, 0.4);
  h2 {
    color: white;
    letter-spacing: 8px;
  }
}
</style>
