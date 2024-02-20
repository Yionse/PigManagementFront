<script setup>
import {
  Button,
  Card,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
} from "ant-design-vue";
import {
  getDoctorList,
  fetchUpdateDoctor,
  fetchDeleteDoctor,
  fetchAddDoctor,
} from "../../apis/doctor"; // 假设存在名为doctor的api文件夹
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";
import { computed, ref, reactive } from "vue";

// 使用useRequest获取医生列表的数据
const { data: doctorData, refreshAsync: refreshDoctor } = getDoctorList();

// 分页相关
const currentPage = ref(1);
const currentPageSize = ref(10);
const tableChangeHandle = ({ current, pageSize }) => {
  currentPage.value = current;
  currentPageSize.value = pageSize;
};
const pagination = computed(() => ({
  total: doctorData.value?.data.length || 0,
  current: currentPage.value,
  pageSize: currentPageSize.value,
  showSizeChanger: true,
}));

// Table展示的列信息
const column = [
  {
    dataIndex: "doctorId",
    title: "医生ID",
  },
  {
    dataIndex: "doctorName",
    title: "医生名称",
  },
  {
    dataIndex: "totalHealing",
    title: "总治疗次数",
  },
  {
    key: "action",
    title: "操作",
  },
];

// 使用useRequest处理异步请求
const { runAsync: updateDoctor } = useRequest(fetchUpdateDoctor);
const { runAsync: deleteDoctor } = useRequest(fetchDeleteDoctor);
const { runAsync: addDoctor } = useRequest(fetchAddDoctor);

// Model相关的变量和方法
const isOpenDoctorModal = ref(false);
const isOpenAddDoctorModal = ref(false);
const formState = reactive({
  doctorId: null,
  doctorName: null,
  totalHealing: 0, // 默认治疗量为0
});

// 打开医生信息编辑弹窗
const openDoctorModal = (record) => {
  isOpenDoctorModal.value = true;
  Object.assign(formState, record);
};

// 关闭医生信息编辑弹窗
const closeDoctorModal = () => {
  isOpenDoctorModal.value = false;
};

// 修改医生信息回调
const updateDoctorHandle = async () => {
  const { doctorId, doctorName, totalHealing } = formState;
  await updateDoctor({
    doctorId,
    doctorName,
    totalHealing,
  });
  await refreshDoctor();
  closeDoctorModal();
  ElMessage.success("修改成功");
};

// 删除医生回调
const deleteDoctorHandle = async (record) => {
  await deleteDoctor(record.doctorId);
  await refreshDoctor();
  ElMessage.success("删除成功");
};

// 打开新增医生弹窗
const openAddDoctorModal = () => {
  isOpenAddDoctorModal.value = true;
  // 清空表单数据，或者根据需要设置默认值
  Object.assign(formState, {
    doctorName: null,
    totalHealing: 0,
  });
};

// 关闭新增医生弹窗
const closeAddDoctorModal = () => {
  isOpenAddDoctorModal.value = false;
};

// 添加医生回调
const addDoctorHandle = async () => {
  await addDoctor(formState);
  await refreshDoctor();
  closeAddDoctorModal();
  ElMessage.success("添加成功");
};
</script>

<template>
  <Card class="mx-4">
    <Button type="primary" class="my-2" @click="openAddDoctorModal"
      >添加医生</Button
    >
    <Table
      :dataSource="doctorData?.data"
      :columns="column"
      :pagination="pagination"
      @change="tableChangeHandle"
      bordered
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <Popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="() => deleteDoctorHandle(record)"
          >
            <Button type="link">解雇</Button>
          </Popconfirm>
          <Button type="link" @click="() => openDoctorModal(record)"
            >修改</Button
          >
        </template>
      </template>
    </Table>

    <!-- 修改医生信息弹窗 -->
    <Modal
      :open="isOpenDoctorModal"
      @ok="updateDoctorHandle"
      @cancel="closeDoctorModal"
      title="修改医生信息"
    >
      <Form :model="formState">
        <Form.Item label="医生ID">
          <Input :value="formState.doctorId" :disabled="true" />
        </Form.Item>
        <Form.Item label="医生名称">
          <Input v-model:value="formState.doctorName" />
        </Form.Item>
        <Form.Item label="总治疗次数">
          <Input v-model:value="formState.totalHealing" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 新增医生弹窗 -->
    <Modal
      :open="isOpenAddDoctorModal"
      @ok="addDoctorHandle"
      @cancel="closeAddDoctorModal"
      title="添加医生信息"
    >
      <Form :model="formState">
        <Form.Item label="医生名称">
          <Input v-model:value="formState.doctorName" />
        </Form.Item>
        <!-- 治疗量默认为0 -->
      </Form>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
