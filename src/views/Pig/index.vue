<script setup>
import { computed, reactive, ref, watch } from "vue";
import {
  getPigList,
  getBreed,
  fetchAddPig,
  fetchUpdatePig,
} from "../../apis/pig";
import {
  Button,
  Card,
  Table,
  Modal,
  Popconfirm,
  Form,
  Input,
  Select,
  Radio,
  DatePicker,
  Tag,
  RadioGroup,
  RadioButton,
  Space,
} from "ant-design-vue";
import { useRequest } from "vue-request";
import moment from "moment";
import { ElMessage } from "element-plus";

// 定义一些请求
const { runAsync, loading } = useRequest(fetchUpdatePig);
const { runAsync: addPig } = useRequest(fetchAddPig);
// 获取当前页面数据
const { data, runAsync: refreshAsync, loading: pigListLoading } = getPigList();
const { data: breedList } = getBreed();

// 是否在栏的数据筛选
const filterConditions = ref({
  isHere: null,
  pigstyPosition: null,
  gender: null,
  type: null,
});

// 定义两个变量控制Model的关闭与开启
const isOpenModal = ref(false);
const isOpenAddModal = ref(false);

// 定义修改时的初始值
const formState = reactive({
  breedId: null,
  pigstyId: null,
  otherInfo: null,
  entryDate: null,
  birthDate: null,
  exitDate: null,
  gender: null,
});

// 定义添加时的初始值
const addState = reactive({
  pigstyId: null,
  breedId: null,
  otherInfo: null,
  birthDate: null,
  gender: "母猪",
});

// Table展示的列信息
const column = [
  {
    dataIndex: "pigId",
    title: "耳号",
  },
  {
    dataIndex: "gender",
    title: "性别",
  },
  {
    dataIndex: "breedId",
    title: "猪种",
    customRender: ({ record }) =>
      breedList?.value?.find((item) => item.breedId == record.breedId)
        ?.breedName,
  },
  {
    dataIndex: "birthDate",
    title: "出生日期",
  },
  {
    dataIndex: "entryDate",
    title: "入栏日期",
  },
  {
    dataIndex: "exitDate",
    title: "出栏日期",
    customRender: ({ text }) => text || "暂未出栏",
  },
  {
    title: "猪舍位置",
    customRender: ({ record }) =>
      data.value?.pigsty.find((item) => item.pigstyId == record.pigstyId)
        ?.pigstyName,
  },
  {
    dataIndex: "otherInfo",
    width: 150,
    title: "其他信息",
    customRender: ({ text }) => text || "暂无",
  },
  { title: "状态", key: "status" },
  {
    title: "操作",
    key: "action",
  },
];

// 使用计算属性,获得当前可以选择的猪舍
const pigstyOptions = computed(() =>
  data.value.pigsty.map((item) => {
    return {
      value: item.pigstyId,
      label: item.pigstyName,
      disabled: item.currentPopulation >= item.capacity,
    };
  })
);

// 使用计算属性，选择对应的猪种
const breedTypeOptions = computed(() =>
  breedList.value.map((item) => {
    return {
      value: item.breedId,
      label: item.breedName,
    };
  })
);

// 修改信息回调
const updateHandleClick = async () => {
  await runAsync(formState);
};

// 出栏回调
const exitHandle = async (record) => {
  await runAsync({
    ...record,
    exitDate: moment().format("YYYY-MM-DD"),
    isExit: true,
  });
  await refreshAsync();
  ElMessage.success("出栏成功");
};

// 添加回调
const addHandleClick = async () => {
  await addPig({
    ...addState,
    birthDate: moment(addState.birthDate).format("YYYY-MM-DD"),
    entryDate: moment().format("YYYY-MM-DD"),
  });
  ElMessage.success("成功添加");
  isOpenAddModal.value = false;
  refreshAsync();
};

//  分页相关
const currentPage = ref(1);
const currentPageSize = ref(10);
const tableChangeHandle = ({ current, pageSize }) => {
  currentPage.value = current;
  currentPageSize.value = pageSize;
};
const newData = ref();

watch(
  () => data.value,
  (newBaseData) => {
    newData.value = newBaseData.pig;
  }
);

watch(
  () => filterConditions.value,
  (newFilterConditions) => {
    refreshAsync({
      breedId: newFilterConditions?.type,
      pigstyId: newFilterConditions?.pigstyPosition,
      gender: newFilterConditions?.gender,
      isHere: newFilterConditions?.isHere,
    });
  }
);
const changeRadioIsHere = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    isHere: e.target.value,
  };
};
const changePosition = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    pigstyPosition: e,
  };
};
const changeGender = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    gender: e.target.value,
  };
};
const changeType = (e) => {
  filterConditions.value = {
    ...filterConditions.value,
    type: e,
  };
};
</script>

<!-- 结构相关，不做过多注释 -->
<template>
  <Card class="mx-4">
    <Card class="mb-2">
      <div class="flex flex-col">
        <Space class="my-2">
          <span class="text">是否在栏：</span>
          <RadioGroup
            v-model:value="filterConditions.isHere"
            class="mx-2"
            @change="changeRadioIsHere"
          >
            <RadioButton :value="1">在栏</RadioButton>
            <RadioButton :value="2">已出栏</RadioButton>
          </RadioGroup>
        </Space>

        <Space class="my-2">
          <span class="text">性别：</span>
          <RadioGroup
            class="mx-2"
            @change="changeGender"
            v-model:value="filterConditions.gender"
          >
            <RadioButton value="公猪">公猪</RadioButton>
            <RadioButton value="母猪">母猪</RadioButton>
          </RadioGroup>
        </Space>
        <Space class="my-2">
          <span class="text">猪舍位置：</span>
          <Select
            v-model:value="filterConditions.pigstyPosition"
            @change="changePosition"
            ref="select"
            style="width: 120px"
            :options="
              data?.pigsty.map((item) => {
                return {
                  label: item.pigstyName,
                  value: item.pigstyId,
                };
              })
            "
          />
        </Space>
        <Space class="my-2">
          <span class="text">品种：</span>
          <Select
            v-model:value="filterConditions.type"
            @change="changeType"
            ref="select"
            style="width: 120px"
            :options="
              breedList?.map((item) => {
                return {
                  label: item.breedName,
                  value: item.breedId,
                };
              })
            "
          />
        </Space>

        <Button
          type="primary"
          class="my-2 w-20"
          @click="
            () => {
              addState.gender = '公猪';
              addState.pigstyId = pigstyOptions.find(
                (item) => item.disabled === false
              ).value;
              addState.breedId = breedList?.[0].breedId;
              isOpenAddModal = true;
            }
          "
          >添加</Button
        >
        <Button
          type="primary w-20"
          @click="
            () => {
              filterConditions = {};
              refreshAsync();
            }
          "
        >
          重置
        </Button>
      </div>
    </Card>

    <Table
      :columns="column"
      :dataSource="newData"
      :pagination="pagination"
      @change="tableChangeHandle"
      bordered
      :loading="pigListLoading || loading"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'status'">
          <Tag :color="!!record.exitDate ? 'green' : 'blue'">{{
            !!record.exitDate ? "已出栏" : "未出栏"
          }}</Tag>
        </template>
        <template v-if="column.key === 'action'">
          <Button
            type="link"
            @click="
              () => {
                isOpenModal = true;
                currentPig = record;
                Object.assign(formState, record);
              }
            "
            :disabled="!!record.exitDate"
            >修改</Button
          >
          <Popconfirm
            title="确定出栏吗?"
            ok-text="确定"
            cancel-text="取消"
            @confirm="() => exitHandle(record)"
            :disabled="!!record.exitDate"
          >
            <Button type="link" :disabled="!!record.exitDate">出栏</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>
  </Card>
  <Modal
    :open="isOpenModal"
    @ok="updateHandleClick"
    @cancel="() => (isOpenModal = false)"
    title="修改种猪信息"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      :model="formState"
    >
      <Form.Item label="耳号">
        <Input :value="formState.pigstyId" :disabled="true" />
      </Form.Item>
      <Form.Item label="性别">
        <Input :value="formState.gender" :disabled="true" />
      </Form.Item>
      <Form.Item label="猪舍位置" name="breedId">
        <Select
          ref="select"
          v-model:value="formState.breedId"
          style="width: 120px"
          :options="breedTypeOptions || []"
          :disabled="true"
        >
        </Select>
      </Form.Item>
      <Form.Item label="出生日期">
        <Input :value="formState.birthDate" :disabled="true" />
      </Form.Item>
      <Form.Item label="入栏日期">
        <Input :value="formState.entryDate" :disabled="true" />
      </Form.Item>
      <Form.Item label="出栏日期">
        <Input :value="formState.exitDate || '暂无'" :disabled="true" />
      </Form.Item>
      <Form.Item label="猪舍位置" name="pigstyId">
        <Select
          ref="select"
          v-model:value="formState.pigstyId"
          style="width: 120px"
          :options="pigstyOptions || []"
        >
        </Select>
      </Form.Item>
      <Form.Item label="其他信息" name="otherInfo">
        <Input :value="formState.otherInfo" />
      </Form.Item>
    </Form>
  </Modal>
  <Modal
    :open="isOpenAddModal"
    @cancel="() => (isOpenAddModal = false)"
    title="添加种猪信息"
    :footer="null"
  >
    <Form
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 20 }"
      :model="addState"
      @finish="addHandleClick"
    >
      <Form.Item label="性别" :rules="[{ required: true }]">
        <Radio.Group v-model:value="addState.gender">
          <Radio value="公猪">公猪</Radio>
          <Radio value="母猪">母猪</Radio>
        </Radio.Group>
      </Form.Item>
      <Form.Item label="猪种" name="breedId" :rules="[{ required: true }]">
        <Select
          ref="select"
          v-model:value="addState.breedId"
          style="width: 120px"
          :options="breedTypeOptions || []"
        >
        </Select>
      </Form.Item>
      <Form.Item
        name="birthDate"
        label="出生日期"
        :rules="[{ required: true, message: '请选择出生日期' }]"
      >
        <DatePicker
          v-model:value="addState.birthDate"
          placeholder="请选择出生日期"
          :disabledDate="
            (current) => current && current.endOf().isAfter(moment())
          "
          :default-value="moment()"
        />
      </Form.Item>
      <Form.Item label="猪舍位置" name="pigstyId" :rules="[{ required: true }]">
        <Select
          ref="select"
          v-model:value="addState.pigstyId"
          style="width: 120px"
          :options="pigstyOptions || []"
        >
        </Select>
      </Form.Item>
      <Form.Item label="其他信息" name="otherInfo">
        <Input v-model:value="addState.otherInfo" />
      </Form.Item>
      <Button type="primary" html-type="submit" class="w-full">提交</Button>
    </Form>
  </Modal>
</template>

<style lang="less">
.text {
  display: block;
  width: 80px !important;
}
</style>
