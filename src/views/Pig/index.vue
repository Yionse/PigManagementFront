<script setup>
import { getPigList } from "../../apis/pig";
import { Card, Table } from "ant-design-vue";

const { data } = getPigList();
const column = [
  {
    dataIndex: "pigId",
    title: "耳号",
  },
];
</script>

<template>
  <Card>
    <Table :columns="column" :dataSource="data?.data"> </Table>
  </Card>
</template>

<style lang="less"></style>
