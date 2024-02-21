<script setup>
import { Table, Card, Button, Tag, Popconfirm, Space } from "ant-design-vue";
import { getEntryRecordList } from "../../apis/manageRecord";
import { QuestionCircleOutlined } from "@ant-design/icons-vue";

// 获取一些数据
const { data: breedList } = getEntryRecordList();

const columns = [
  { dataIndex: "recordId", title: "入栏编号" },
  {
    dataIndex: "pigId",
    title: "种猪Id",
  },
  {
    title: "入栏时间",
    dataIndex: "entryDate",
  },
  {
    title: "入栏原因",
    dataIndex: "entryReason",
  },
];
</script>

<template>
  <Card class="mx-4">
    <Space><QuestionCircleOutlined />入栏记录无法删除修改添加</Space>
    <Table :columns="columns" :dataSource="breedList?.data || []"> </Table>
  </Card>
</template>

<style lang="less"></style>
