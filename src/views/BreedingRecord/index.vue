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
import { computed, ref, reactive } from "vue";
import {
  fetchAddBreeding,
  fetchDeleteBreeding,
  fetchUpdateBreeding,
  getBreedingList,
} from "../../apis/breedingRecord";
import { getPigList } from "../../apis/pig";
import moment from "moment";

// 使用useRequest获取繁殖列表的数据
const { data: breedingRecord, refreshAsync: refetchBreeding } =
  getBreedingList();
const { data: pigList } = getPigList();
console.log(pigList, "piglist");

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
    dataIndex: "boarId",
    title: "公猪耳号",
  },
  {
    dataIndex: "sowId",
    title: "母猪耳号",
  },
  {
    dataIndex: "breedingDate",
    title: "生产日期",
  },
  {
    dataIndex: "count",
    title: "生产数量",
  },
];

// 使用useRequest处理异步请求
const { runAsync: deleteDoctor } = useRequest(fetchDeleteBreeding);
const { runAsync: addDoctor } = useRequest(fetchAddBreeding);

// Model相关的变量和方法
const isOpenDoctorModal = ref(false);
const isOpenAddDoctorModal = ref(false);
const formState = reactive({
  boarId: null,
  sowId: null,
  breedingDate: null,
  count: 1,
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

// 删除医生回调
const deleteDoctorHandle = async (record) => {
  await deleteDoctor(record.doctorId);
  await refetchBreeding();
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
  await addDoctor({
    ...formState,
    breedingDate: moment(formState.breedingDate).format("YYYY-MM-DD"),
  });
  await refetchBreeding();
  closeAddDoctorModal();
  ElMessage.success("添加成功");
};
</script>

<template>
  <Card class="mx-4">
    <Button type="primary" class="my-2" @click="openAddDoctorModal"
      >添加繁殖记录</Button
    >
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

    <!-- 新增医生弹窗 -->
    <Modal
      :open="isOpenAddDoctorModal"
      @ok="addDoctorHandle"
      @cancel="closeAddDoctorModal"
      title="添加繁殖信息"
    >
      <Form :model="formState">
        <Form.Item name="sow" label="母猪">
          <Select
            v-model:value="formState.sowId"
            style="width: 120px"
            :options="
              pigList?.pig
                .filter((item) => item.gender === '母猪')
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
        <Form.Item name="boar" label="公猪">
          <Select
            v-model:value="formState.boarId"
            style="width: 120px"
            :options="
              pigList?.pig
                .filter((item) => item.gender === '公猪')
                .map((item) => {
                  return {
                    value: item.pigId,
                    label: item.pigId,
                  };
                }) || []
            "
          >
          </Select
        ></Form.Item>
        <Form.Item
          name="breedingDate"
          label="出生日期"
          :rules="[{ required: true, message: '请选择出生日期' }]"
        >
          <DatePicker
            v-model:value="formState.breedingDate"
            placeholder="请选择出生日期"
            :disabledDate="
              (current) => current && current.endOf().isAfter(moment())
            "
            :default-value="moment()"
          />
        </Form.Item>
        <Form.Item label="猪仔数量">
          <Input v-model:value="formState.count" />
        </Form.Item>
      </Form>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
