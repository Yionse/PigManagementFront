<script setup>
import { ElMessage } from "element-plus";
import { reactive, ref } from "vue";
import { fetchRegister } from "../../../apis/user";
import { useRequest } from "vue-request";

const { loading, runAsync } = useRequest(fetchRegister);

//  引入Form实例
const ruleFormRef = ref();

// Form中的每一项，通过此可以拿到表单的值
const formLabelAlign = reactive({
  name: "",
  pass: "",
  account: "",
  confirmPass: "",
});

// 验证规则
const rules = {
  name: {
    required: true,
    message: "请输入用户名",
    trigger: "blur",
  },
  account: {
    required: true,
    message: "请输入账号",
    trigger: "blur",
  },
  pass: [
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
  confirmPass: [
    { required: true, message: "请输入密码" },
    {
      // 通过自定义校验，判断第二次的密码是否和第一次一致
      validator(_, value, callback) {
        if (!value) {
          callback(new Error("请输入密码"));
        } else if (value !== formLabelAlign.pass) {
          callback(new Error("两次密码不一致"));
        } else {
          callback();
        }
      },
      trigger: "blur",
    },
  ],
};

// 点击了注册按钮的回调
const submitForm = (formEl) => {
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
      const res = await runAsync({
        account: formLabelAlign.account,
        username: formLabelAlign.name,
        password: formLabelAlign.pass,
      });
      if (res?.isSuccess) {
        ElMessage.success("注册成功");
      }
    }
  });
};
</script>

<template>
  <el-form
    class="mx-auto my-7"
    label-position="left"
    label-width="100px"
    :model="formLabelAlign"
    :rules="rules"
    ref="ruleFormRef"
  >
    <el-form-item label="用户名：" prop="name">
      <el-input v-model="formLabelAlign.name" placeholder="请输入用户名">
        <template #prepend>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="账号：" prop="account">
      <el-input
        type="number"
        v-model="formLabelAlign.account"
        placeholder="请输入账号"
      >
        <template #prepend>
          <el-icon><User /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="pass">
      <el-input
        type="password"
        v-model="formLabelAlign.pass"
        placeholder="请输入密码"
      >
        <template #prepend>
          <el-icon><Lock /></el-icon>
        </template>
      </el-input>
    </el-form-item>
    <el-form-item label="密码：" prop="confirmPass">
      <el-input
        type="password"
        v-model="formLabelAlign.confirmPass"
        placeholder="请再次输入密码"
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
      >注册</el-button
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
