<script setup>
import {
  Button,
  Card,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
} from "ant-design-vue";

import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";
import { computed, ref, reactive, watch } from "vue";
import {
  fetchAddBreedings,
  fetchDeleteBreedings,
  fetchUpdateBreedings,
  getBreedingsList,
} from "../../apis/breeding";
import { getBreed, getPigList } from "../../apis/pig";
import moment from "moment";

// 使用useRequest获取繁殖列表的数据
const { data: breedingRecord, runAsync: refetchBreeding } = getBreedingsList();
const { data: pigList } = getPigList();
const { data } = getBreed();

// 筛选相关
const filterConditions = ref({
  sowId: null,
  boarId: null,
  status: null,
});

// 分页相关
const currentPage = ref(1);
const currentPageSize = ref(10);
const tableChangeHandle = ({ current, pageSize }) => {
  currentPage.value = current;
  currentPageSize.value = pageSize;
};
const pagination = computed(() => ({
  total: breedingRecord.value?.data.length || 0,
  current: currentPage.value,
  pageSize: currentPageSize.value,
  showSizeChanger: true,
}));

// Table展示的列信息
const column = [
  {
    dataIndex: "sowID",
    title: "母猪耳号",
  },
  {
    dataIndex: "boarId",
    title: "公猪耳号",
  },
  {
    dataIndex: "EhId",
    title: "仔猪耳号",
  },
  {
    dataIndex: "birthDay",
    title: "仔猪出生日期",
  },
  {
    dataIndex: "weight",
    title: "体重（公斤）",
  },
  {
    dataIndex: "status",
    title: "健康情况",
  },
  {
    dataIndex: "oneDate",
    title: "配种期",
  },
  {
    dataIndex: "twoDate",
    title: "分娩期",
  },
  {
    dataIndex: "oneCount",
    title: "健仔",
  },
  {
    dataIndex: "twoCount",
    title: "弱仔",
  },
];

// 使用useRequest处理异步请求
const { runAsync: deleteDoctor } = useRequest(fetchDeleteBreedings);
const { runAsync: addDoctor } = useRequest(fetchAddBreedings);

// Model相关的变量和方法
const isOpenDoctorModal = ref(false);
const isOpenAddDoctorModal = ref(false);
const formState = reactive({
  sowID: null,
  boarId: null,
  ehId: null,
  birthDay: null,
  weight: null,
  status: null,
  oneDate: null,
  twoDate: null,
  oneCount: null,
  twoCount: null,
});

// 打开育种信息编辑弹窗
const openDoctorModal = (record) => {
  isOpenDoctorModal.value = true;
  Object.assign(formState, record);
};

// 关闭育种信息编辑弹窗
const closeDoctorModal = () => {
  isOpenDoctorModal.value = false;
};

// 删除育种记录回调
const deleteDoctorHandle = async (record) => {
  await deleteDoctor(record.doctorId);
  await refetchBreeding();
  ElMessage.success("删除成功");
};

// 打开新增育种弹窗
const openAddDoctorModal = () => {
  isOpenAddDoctorModal.value = true;
  // 清空表单数据，或者根据需要设置默认值
  formState.value = {};
};

// 关闭新增育种弹窗
const closeAddDoctorModal = () => {
  isOpenAddDoctorModal.value = false;
};

// 添加育种回调
const addDoctorHandle = async () => {
  await addDoctor({
    ...formState,
    oneDate: moment(formState.oneDate).format("YYYY-MM-DD"),
    twoDate: moment(formState.twoDate).format("YYYY-MM-DD"),
    birthDay: moment(formState.birthDay).format("YYYY-MM-DD"),
    weight: Number(formState.weight),
  });
  await refetchBreeding();
  closeAddDoctorModal();
  ElMessage.success("添加成功");
};

const changeSowId = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    sowId: e,
  };
};

const changeBoar = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    boarId: e,
  };
};

const changeStatus = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    status: e,
  };
};

watch(
  () => filterConditions.value,
  (newFilterConditions) => {
    refetchBreeding(newFilterConditions);
  }
);
</script>

<template>
  <Card class="mx-4">
    <Card class="my-2">
      <div class="flex flex-col">
        <Space class="my-2">
          <span>母猪耳号：</span>
          <Select
            @change="changeSowId"
            style="width: 120px"
            v-model:value="filterConditions.sowId"
            :options="
              pigList?.pig
                .filter((item) => item.gender === '母猪')
                .map((item) => {
                  return {
                    label: item.pigId,
                    value: item.pigId,
                  };
                })
            "
          />
        </Space>
        <Space class="my-2">
          <span>公猪耳号：</span>
          <Select
            @change="changeBoar"
            style="width: 120px"
            v-model:value="filterConditions.boarId"
            :options="
              pigList?.pig
                .filter((item) => item.gender === '公猪')
                .map((item) => {
                  return {
                    label: item.pigId,
                    value: item.pigId,
                  };
                })
            "
          />
        </Space>
        <Space class="my-2">
          <span>健康状态：</span>
          <Select
            @change="changeStatus"
            v-model:value="filterConditions.status"
            style="width: 120px"
            :options="[
              { label: '健康', value: '健康' },
              { label: '良好', value: '良好' },
              { label: '差劲', value: '差劲' },
            ]"
          />
        </Space>

        <Button type="primary" class="my-2 w-32" @click="openAddDoctorModal"
          >添加育种记录</Button
        >
        <Button
          type="primary"
          class="my-2 w-32"
          @click="
            () => {
              filterConditions = {};
              refetchBreeding();
            }
          "
          >重置</Button
        >
      </div>
    </Card>
    <Table
      :dataSource="breedingRecord?.data"
      :columns="column"
      :pagination="pagination"
      @change="tableChangeHandle"
      bordered
    >
      <!-- <template #bodyCell="{ column, record }">
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
      </template> -->
    </Table>

    <!-- 新增育种记录弹窗 -->
    <Modal
      :open="isOpenAddDoctorModal"
      @ok="addDoctorHandle"
      @cancel="closeAddDoctorModal"
      title="添加育种信息"
    >
      <Form
        :model="formState"
        :label-col="{ span: 6 }"
        :wrapper-col="{ span: 12 }"
        labelAlign="left"
      >
        <Form.Item name="sowID" label="母猪">
          <Select
            v-model:value="formState.sowID"
            style="width: 120px"
            :options="
              pigList?.pig
                .filter(
                  (item) => item.gender === '母猪' && item.exitDate === null
                )
                .map((item) => {
                  return {
                    value: item.pigId,
                    label: item.pigId,
                  };
                }) || []
            "
          >
          </Select>
        </Form.Item>
        <Form.Item name="boarId" label="公猪">
          <Select
            v-model:value="formState.boarId"
            style="width: 120px"
            :options="
              pigList?.pig
                .filter(
                  (item) => item.gender === '公猪' && item.exitDate === null
                )
                .map((item) => {
                  return {
                    value: item.pigId,
                    label: item.pigId,
                  };
                }) || []
            "
          >
          </Select>
        </Form.Item>
        <Form.Item name="birthDay" label="仔猪出生日期">
          <DatePicker
            v-model:value="formState.birthDay"
            placeholder="请选择出生日期"
            :default-value="moment()"
          />
        </Form.Item>
        <Form.Item name="weight" label="体重（公斤）">
          <Input v-model:value="formState.weight" />
        </Form.Item>
        <Form.Item name="status" label="健康情况">
          <Select
            v-model:value="formState.status"
            style="width: 120px"
            :options="[
              { label: '健康', value: '健康' },
              { label: '良好', value: '良好' },
              { label: '差劲', value: '差劲' },
            ]"
          >
          </Select
        ></Form.Item>
        <Form.Item name="oneDate" label="配种期">
          <DatePicker
            v-model:value="formState.oneDate"
            placeholder="请选择出生日期"
            :default-value="moment()"
          />
        </Form.Item>
        <Form.Item name="twoDate" label="分娩期">
          <DatePicker
            v-model:value="formState.twoDate"
            placeholder="请选择出生日期"
            :default-value="moment()"
          />
        </Form.Item>
        <Form.Item name="oneCount" label="健仔">
          <Input v-model:value="formState.oneCount" />
        </Form.Item>
        <Form.Item name="twoCount" label="弱仔">
          <Input v-model:value="formState.twoCount" />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
