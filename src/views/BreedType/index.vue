<script setup>
import { computed, ref } from "vue";
import {
  getBreed,
  getPigList,
  fetchDeleteBreedType,
  fetchAddBreedType,
} from "../../apis/pig";
import {
  Table,
  Card,
  Button,
  Modal,
  Tag,
  Popconfirm,
  Input,
} from "ant-design-vue";
import { useRequest } from "vue-request";
import { ElMessage } from "element-plus";

// 获取一些数据
const { data: breedList, loading, refreshAsync: reGetBreed } = getBreed();
const { data: pigList, refreshAsync } = getPigList();
const { runAsync, loading: delLoading } = useRequest(fetchDeleteBreedType);
const { runAsync: addBreedType } = useRequest(fetchAddBreedType);

// 定义添加时输入的品种名称
let addBreedTypeName = ref();

// 控制Modal
let isShowModal = ref(false);

// 通过计算属性得出需要的数据
const tableData = computed(() => {
  return breedList.value?.map((item) => {
    let number = 0;
    pigList.value?.pig?.forEach((pig) => {
      if (pig.breedId === item.breedId) {
        number += 1;
      }
    });
    item.number = number;
    return item;
  });
});

const columns = [
  {
    dataIndex: "breedName",
    title: "品种",
  },
  {
    title: "当前数量",
    key: "number",
  },
  {
    title: "操作",
    key: "delete",
  },
];

// 删除品种的操作
const deleteHandle = async (breedId) => {
  await runAsync({ breedId });
  await refreshAsync();
  await reGetBreed();
  ElMessage.success("删除品种成功");
};

// 添加品种操作
const addBreedTypeHandle = async () => {
  if (addBreedTypeName.value) {
    await addBreedType({ breedName: addBreedTypeName.value });
    await reGetBreed();
    await refreshAsync();
    ElMessage.success("添加品种成功");
    isShowModal.value = false;
    addBreedTypeName = "";
  } else {
    ElMessage.error("输入不能为空");
    return;
  }
};
</script>

<template>
  <Card class="mx-4">
    <Button type="primary" class="my-4" @click="() => (isShowModal = true)"
      >添加</Button
    >
    <Table
      :loading="loading || delLoading"
      :columns="columns"
      :dataSource="tableData || []"
    >
      <template #bodyCell="{ column, record }">
        <template v-if="column.key === 'number'">
          <Tag :color="record.number > 10 ? 'red' : 'green'">{{
            record?.number
          }}</Tag>
        </template>
        <template v-if="column.key === 'delete'">
          <Popconfirm
            title="确定要删除该品种吗？"
            ok-text="确定"
            @confirm="() => deleteHandle(record.breedId)"
            :disabled="record.number !== 0"
          >
            <Button type="link" :disabled="record.number !== 0">删除</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>
  </Card>
  <Modal
    :open="isShowModal"
    :cancel="
      () => {
        isShowModal = false;
        addBreedTypeName = '';
      }
    "
    title="添加猪品种"
    ok-text="添加"
    @ok="addBreedTypeHandle"
  >
    <Input
      v-model:value="addBreedTypeName"
      placeholder="输入一个猪品种"
      max="20"
    />
  </Modal>
</template>

<style lang="less"></style>
