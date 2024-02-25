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
  getPigstyList,
  fetchUpdatePigsty,
  fetchDeletePigsty,
  fetchAddPigsty,
} from "../../apis/pigsty";
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";
import { computed, ref, reactive } from "vue";

// 获取猪舍列表数据和刷新方法
const { data: pigstyData, refreshAsync: refreshPigsty } = getPigstyList();

// 分页相关
const currentPage = ref(1);
const currentPageSize = ref(10);
const tableChangeHandle = ({ current, pageSize }) => {
  currentPage.value = current;
  currentPageSize.value = pageSize;
};
const pagination = computed(() => ({
  total: pigstyData.value?.data.length || 0,
  current: currentPage.value,
  pageSize: currentPageSize.value,
  showSizeChanger: true,
}));

// Table展示的列信息
const column = [
  {
    dataIndex: "pigstyId",
    title: "猪舍ID",
  },
  {
    dataIndex: "pigstyName",
    title: "猪舍名称",
  },
  {
    dataIndex: "capacity",
    title: "容量",
  },
  {
    dataIndex: "currentPopulation",
    title: "当前数量",
  },
  {
    dataIndex: "humidityRecord",
    title: "湿度",
  },
  {
    dataIndex: "temperatureRecord",
    title: "温度",
  },
  {
    dataIndex: "otherInfo",
    title: "其他信息",
  },
  {
    key: "action",
    title: "操作",
  },
];

// 使用useRequest创建updatePigsty、deletePigsty、addPigsty的请求
const { runAsync: updatePigsty } = useRequest(fetchUpdatePigsty);
const { runAsync: deletePigsty } = useRequest(fetchDeletePigsty);
const { runAsync: addPigsty } = useRequest(fetchAddPigsty);

// Model相关的变量和方法
const isOpenPigstyModal = ref(false);
const isOpenAddPigstyModal = ref(false);
const formState = reactive({
  pigstyId: null,
  temperatureRecord: null,
  humidityRecord: null,
  otherInfo: null,
});

// 打开修改猪舍的Modal，并初始化表单数据
const openPigstyModal = (record) => {
  isOpenPigstyModal.value = true;
  Object.assign(formState, record);
};

// 关闭修改猪舍的Modal
const closePigstyModal = () => {
  isOpenPigstyModal.value = false;
};

// 修改猪舍的回调函数
const updatePigstyHandle = async () => {
  const { pigstyId, temperatureRecord, humidityRecord, otherInfo } = formState;
  await updatePigsty({
    pigstyId,
    temperatureRecord,
    humidityRecord,
    otherInfo,
  });
  await refreshPigsty();
  closePigstyModal();
  ElMessage.success("修改成功");
};

// 删除猪舍的回调函数
const deletePigstyHandle = async (record) => {
  await deletePigsty(record.pigstyId);
  await refreshPigsty();
  ElMessage.success("删除成功");
};

// 打开添加猪舍的Modal，并清空表单数据或设置默认值
const openAddPigstyModal = () => {
  isOpenAddPigstyModal.value = true;
  Object.assign(formState, {
    pigstyName: null,
    capacity: null,
    currentPopulation: null,
    temperatureRecord: null,
    humidityRecord: null,
    otherInfo: null,
  });
};

// 关闭添加猪舍的Modal
const closeAddPigstyModal = () => {
  isOpenAddPigstyModal.value = false;
};

// 添加猪舍的回调函数
const addPigstyHandle = async () => {
  await addPigsty(formState);
  await refreshPigsty();
  closeAddPigstyModal();
  ElMessage.success("添加成功");
};
</script>

<template>
  <Card class="mx-4">
    <!-- 添加按钮 -->
    <Button type="primary" class="my-2" @click="openAddPigstyModal"
      >添加</Button
    >
    <!-- 猪舍列表Table -->
    <Table
      :dataSource="pigstyData?.data"
      :columns="column"
      :pagination="pagination"
      @change="tableChangeHandle"
      bordered
    >
      <!-- 自定义表格列内容 -->
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'action'">
          <!-- 删除按钮，可弹出确认框 -->
          <Popconfirm
            title="确定删除吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="() => deletePigstyHandle(record)"
            :disabled="record.currentPopulation > 0"
          >
            <Button type="link" :disabled="record.currentPopulation > 0"
              >删除</Button
            >
          </Popconfirm>
          <!-- 修改按钮，打开修改猪舍的Modal -->
          <Button type="link" @click="() => openPigstyModal(record)"
            >修改</Button
          >
        </template>
      </template>
    </Table>

    <!-- 修改猪舍的Modal -->
    <Modal
      :open="isOpenPigstyModal"
      @ok="updatePigstyHandle"
      @cancel="closePigstyModal"
      title="修改猪舍信息"
    >
      <!-- 修改猪舍表单 -->
      <Form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
      >
        <Form.Item label="猪舍ID">
          <Input :value="formState.pigstyId" :disabled="true" />
        </Form.Item>
        <Form.Item label="温度">
          <Input v-model:value="formState.temperatureRecord" />
        </Form.Item>
        <Form.Item label="湿度">
          <Input v-model:value="formState.humidityRecord" />
        </Form.Item>
        <Form.Item label="其他信息">
          <Input v-model:value="formState.otherInfo" />
        </Form.Item>
      </Form>
    </Modal>

    <!-- 添加猪舍的Modal -->
    <Modal
      :open="isOpenAddPigstyModal"
      @ok="addPigstyHandle"
      @cancel="closeAddPigstyModal"
      title="添加猪舍信息"
    >
      <!-- 添加猪舍表单 -->
      <Form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
        labelAlign="left"
      >
        <Form.Item label="猪舍名称">
          <Input v-model:value="formState.pigstyName" />
        </Form.Item>
        <Form.Item label="容量">
          <Input v-model:value="formState.capacity" />
        </Form.Item>
        <Form.Item label="当前数量">
          <Input v-model:value="formState.currentPopulation" />
        </Form.Item>
        <Form.Item label="温度">
          <Input v-model:value="formState.temperatureRecord" />
        </Form.Item>
        <Form.Item label="湿度">
          <Input v-model:value="formState.humidityRecord" />
        </Form.Item>
        <Form.Item label="其他信息">
          <Input v-model:value="formState.otherInfo" />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
