<script setup>
import { Table, Card, Button, Tag, Popconfirm, Space } from "ant-design-vue";
import { getExitRecordList } from "../../apis/manageRecord";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";
// 获取一些数据
const { data: breedList } = getExitRecordList();
console.log(breedList, "这里又有值了");
const columns = [
  {
    dataIndex: "pigId",
    title: "耳号",
  },
  {
    title: "出栏时间",
    dataIndex: "exitDate",
  },
  {
    title: "出栏原因",
    dataIndex: "exitReason",
  },
];
</script>

<template>
  <Card class="mx-4">
    <Space><QuestionCircleOutlined />出栏记录无法删除修改添加</Space>
    <Table :columns="columns" :dataSource="breedList?.data || []">
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
            @confirm="() => deleteHandle(record.recordId)"
          >
            <Button type="link">删除</Button>
          </Popconfirm>
        </template>
      </template>
    </Table>
  </Card>
</template>

<style lang="less"></style>
