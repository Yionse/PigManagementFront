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
  fetchAddBreeding,
  fetchDeleteBreeding,
  fetchUpdateBreeding,
  getBreedingList,
} from "../../apis/breedingRecord";
import { getBreed, getPigList } from "../../apis/pig";
import moment from "moment";

// 使用useRequest获取繁殖列表的数据
const { data: breedingRecord, runAsync: refetchBreeding } = getBreedingList();
const { data: pigList } = getPigList();
const { data } = getBreed();

// 筛选相关
const filterConditions = ref({
  sowId: null,
  type: null,
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
    dataIndex: "sowId",
    title: "母猪耳号",
  },
  {
    dataIndex: "type",
    title: "猪品种",
  },
  {
    dataIndex: "status",
    title: "配前状态",
  },
  {
    dataIndex: "birthsCount",
    title: "分娩胎次",
  },
  {
    dataIndex: "statusDays",
    title: "状态天数",
  },
  {
    dataIndex: "loveDays",
    title: "情期",
  },
  {
    dataIndex: "customDate",
    title: "输精日期",
  },
  {
    dataIndex: "timer",
    title: "时间",
  },
  {
    dataIndex: "market",
    title: "备注",
  },
];

// 使用useRequest处理异步请求
const { runAsync: deleteDoctor } = useRequest(fetchDeleteBreeding);
const { runAsync: addDoctor } = useRequest(fetchAddBreeding);

// Model相关的变量和方法
const isOpenDoctorModal = ref(false);
const isOpenAddDoctorModal = ref(false);
const formState = reactive({
  sowId: null,
  type: null,
  status: null,
  birthsCount: null,
  statusDays: null,
  loveDays: null,
  customDate: null,
  timer: null,
  market: null,
});

// 打开繁殖记录信息编辑弹窗
const openDoctorModal = (record) => {
  isOpenDoctorModal.value = true;
  Object.assign(formState, record);
};

// 关闭繁殖记录信息编辑弹窗
const closeDoctorModal = () => {
  isOpenDoctorModal.value = false;
};

// 删除繁殖记录回调
const deleteDoctorHandle = async (record) => {
  await deleteDoctor(record.doctorId);
  await refetchBreeding();
  ElMessage.success("删除成功");
};

// 打开新增繁殖记录弹窗
const openAddDoctorModal = () => {
  isOpenAddDoctorModal.value = true;
  // 清空表单数据，或者根据需要设置默认值
  formState.value = {};
};

// 关闭新增繁殖记录弹窗
const closeAddDoctorModal = () => {
  isOpenAddDoctorModal.value = false;
};

// 添加繁殖记录回调
const addDoctorHandle = async () => {
  await addDoctor({
    ...formState,
    customDate: moment(formState.customDate).format("YYYY-MM-DD"),
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

const changeType = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    type: e,
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
              breedingRecord?.data.map((item) => {
                return {
                  label: item.sowId,
                  value: item.sowId,
                };
              })
            "
          />
        </Space>
        <Space class="my-2">
          <span>配前状态：</span>
          <Select
            @change="changeStatus"
            v-model:value="filterConditions.status"
            style="width: 120px"
            :options="[
              { label: '后备', value: '后备' },
              { label: '怀孕', value: '怀孕' },
              { label: '正常', value: '正常' },
            ]"
          />
        </Space>
        <Space class="my-2">
          <span>猪品种：</span>
          <Select
            @change="changeType"
            v-model:value="filterConditions.type"
            style="width: 120px"
            :options="
              breedingRecord?.data.map((item) => {
                return {
                  label: item.type,
                  value: item.type,
                };
              })
            "
          />
        </Space>

        <Button type="primary" class="my-2 w-32" @click="openAddDoctorModal"
          >添加繁殖记录</Button
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

    <!-- 新增繁殖记录弹窗 -->
    <Modal
      :open="isOpenAddDoctorModal"
      @ok="addDoctorHandle"
      @cancel="closeAddDoctorModal"
      title="添加繁殖信息"
    >
      <Form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        labelAlign="left"
      >
        <Form.Item name="sowId" label="母猪">
          <Select
            v-model:value="formState.sowId"
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
        <Form.Item name="type" label="猪品种">
          <Select
            v-model:value="formState.type"
            style="width: 120px"
            :options="
              data?.map((item) => {
                return {
                  label: item.breedName,
                  value: item.breedName,
                };
              })
            "
          >
          </Select
        ></Form.Item>
        <Form.Item name="status" label="配前状态">
          <Select
            v-model:value="formState.status"
            style="width: 120px"
            :options="[
              { label: '后备', value: '后备' },
              { label: '怀孕', value: '怀孕' },
              { label: '正常', value: '正常' },
            ]"
          >
          </Select
        ></Form.Item>
        <Form.Item name="birthsCount" label="分娩胎次">
          <Input v-model:value="formState.birthsCount" />
        </Form.Item>
        <Form.Item name="statusDays" label="状态天数">
          <Input v-model:value="formState.statusDays" />
        </Form.Item>
        <Form.Item name="loveDays" label="情期">
          <Input v-model:value="formState.loveDays" />
        </Form.Item>
        <Form.Item name="customDate" label="输精日期">
          <DatePicker
            v-model:value="formState.customDate"
            placeholder="请选择出生日期"
            :default-value="moment()"
          />
        </Form.Item>
        <Form.Item name="timer" label="时间">
          <Input v-model:value="formState.timer" />
        </Form.Item>
        <Form.Item name="market" label="备注">
          <Input v-model:value="formState.market" />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
