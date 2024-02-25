<script setup>
import {
  Button,
  Card,
  Popconfirm,
  Table,
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
} from "ant-design-vue";
import {
  getHealthList,
  fetchAddHealth,
  fetchUpdateHealth,
  fetchDeleteHealth,
} from "../../apis/health";
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";
import { computed, ref, reactive, watch } from "vue";
import { getDoctorList } from "../../apis/doctor";
import { getPigList } from "../../apis/pig";
import moment from "moment";

// 使用useRequest获取生病列表列表的数据
const { data: healthList, refreshAsync: refetchHeal } = getHealthList();
const { data: doctorList } = getDoctorList();
const { data: pigList } = getPigList();

// 分页相关
const currentPage = ref(1);
const currentPageSize = ref(10);
const tableChangeHandle = ({ current, pageSize }) => {
  currentPage.value = current;
  currentPageSize.value = pageSize;
};
const pagination = computed(() => ({
  total: healthList.value?.data.length || 0,
  current: currentPage.value,
  pageSize: currentPageSize.value,
  showSizeChanger: true,
}));

// Table展示的列信息
const column = [
  {
    dataIndex: "pigId",
    title: "耳号",
  },
  {
    dataIndex: "diseaseName",
    title: "疾病名称",
  },
  {
    dataIndex: "symptoms",
    title: "症状",
  },
  {
    dataIndex: "treatmentDate",
    title: "治疗日期",
  },
  {
    dataIndex: "treatmentMethod",
    title: "治疗方法",
  },
  {
    title: "医生名称",
    customRender: ({ record }) =>
      doctorList.value?.data?.find((item) => item.doctorId == record.doctorId)
        ?.doctorName || "当前医生已离职",
  },
];

// 使用useRequest处理异步请求
const { runAsync: updateDoctor } = useRequest(fetchUpdateHealth);
const { runAsync: deleteDoctor } = useRequest(fetchDeleteHealth);
const { runAsync: addDoctor } = useRequest(fetchAddHealth);

// Model相关的变量和方法
const isOpenDoctorModal = ref(false);
const isOpenAddDoctorModal = ref(false);
const formState = reactive({
  pigId: null,
  diseaseName: null,
  symptoms: null,
  treatmentDate: null,
  treatmentMethod: null,
  doctorId: null,
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

// const updateDoctorHandle = async () => {
//   const { doctorId, doctorName, totalHealing } = formState;
//   await updateDoctor(formState);
//   await refetchHeal();
//   closeDoctorModal();
//   ElMessage.success("修改成功");
// };

const deleteDoctorHandle = async (record) => {
  await deleteDoctor([record.doctorId]);
  await refetchHeal();
  ElMessage.success("删除成功");
};

const openAddDoctorModal = () => {
  isOpenAddDoctorModal.value = true;
  // 清空表单数据，或者根据需要设置默认值
  Object.assign(formState, {
    pigId: null,
    diseaseName: null,
    symptoms: null,
    treatmentDate: null,
    treatmentMethod: null,
    doctorId: null,
  });
};

const closeAddDoctorModal = () => {
  isOpenAddDoctorModal.value = false;
};

const addDoctorHandle = async () => {
  await addDoctor({
    ...formState,
    treatmentDate: moment(formState.treatmentDate).format("YYYY-MM-DD"),
  });
  await refetchHeal();
  closeAddDoctorModal();
  ElMessage.success("添加成功");
};

const allData = ref();
watch(
  () => healthList.value,
  (healthList) => {
    console.log(doctorList);
    const newData = healthList?.data.map((item) => {
      const doctor = doctorList.value?.data.find(
        (doctor) => item.doctorId == doctor.doctorId
      );
      console.log(doctor);
      return {
        ...item,
        doctorName: doctor?.doctorName || "医生已被解雇",
      };
    });
    allData.value = newData;
  }
);

const newPig = ref();
watch(
  () => pigList.value,
  (pigList) => {
    const newData = pigList?.pig
      .filter((item) => item.exitDate === null)
      .map((item) => {
        {
          return {
            label: item.pigId,
            value: item.pigId,
          };
        }
      });
    newPig.value = newData;
  }
);

const newDoctor = ref();
watch(
  () => doctorList.value,
  (doctorList) => {
    const newData = doctorList?.data?.map((item) => {
      {
        return {
          label: item.doctorName,
          value: item.doctorId,
        };
      }
    });
    newDoctor.value = newData;
  }
);
</script>

<template>
  <Card class="mx-4">
    <Button type="primary" class="my-2" @click="openAddDoctorModal"
      >添加生病记录</Button
    >
    <Table
      :dataSource="allData"
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

    <!-- <Modal
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
    </Modal> -->

    <Modal
      :open="isOpenAddDoctorModal"
      @ok="addDoctorHandle"
      @cancel="closeAddDoctorModal"
      title="添加病猪信息"
    >
      <Form
        :model="formState"
        :label-col="{ span: 4 }"
        :wrapper-col="{ span: 12 }"
        labelAlign="left"
      >
        <Form.Item label="种猪" name="pigId">
          <Select
            v-model:value="formState.pigId"
            style="width: 120px"
            :options="newPig"
          >
          </Select>
        </Form.Item>
        <!-- 治疗量默认为0 -->
      </Form>
      <Form.Item label="疾病名称" name="diseaseName">
        <Input v-model:value="formState.diseaseName" />
      </Form.Item>
      <Form.Item label="症状" name="symptoms">
        <Input v-model:value="formState.symptoms" />
      </Form.Item>
      <Form.Item label="治疗方法" name="treatmentMethod">
        <Input v-model:value="formState.treatmentMethod" />
      </Form.Item>
      <Form.Item name="treatmentDate" label="治疗日期">
        <DatePicker
          v-model:value="formState.treatmentDate"
          placeholder="请选择治疗日期"
          :disabledDate="
            (current) => current && current.endOf().isAfter(moment())
          "
          :default-value="moment()"
        />
      </Form.Item>
      <Form.Item label="主治医师" name="doctorId">
        <Select
          v-model:value="formState.doctorId"
          style="width: 120px"
          :options="newDoctor"
        >
        </Select>
      </Form.Item>
    </Modal>
  </Card>
</template>

<style lang="less"></style>
