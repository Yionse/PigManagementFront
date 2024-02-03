<script setup>
import { onMounted } from "vue";
import { Card } from "ant-design-vue";
import * as echarts from "echarts";

onMounted(() => {
  const chartDom = document.getElementById("charts");
  const myChart = echarts.init(chartDom);
  const option = {
    xAxis: {
      type: "category",
      data: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
    },
    yAxis: {
      type: "value",
    },
    series: [
      {
        data: [
          120,
          {
            value: 200,
            itemStyle: {
              color: "#a90000",
            },
          },
          200,
          80,
          70,
          110,
          130,
        ],
        type: "bar",
      },
    ],
  };
  myChart.setOption(option);
});
</script>

<template>
  <div class="flex flex-row justify-between p-4">
    <Card class="w-2/3">
      <div class="small-title">
        <h1>种猪数量</h1>
        <span class="text-xl">112</span>
      </div>
      <div class="small-title">
        <h1>猪舍数量</h1>
        <span class="text-xl">112</span>
      </div>
      <div class="small-title">
        <h1>品种数量</h1>
        <span class="text-xl">112</span>
      </div>
      <div class="small-title">
        <h1>近期病猪</h1>
        <span class="text-xl">112</span>
      </div>
      <div class="small-title">
        <h1>在职医生数</h1>
        <span class="text-xl">112</span>
      </div>
      <div class="small-title">
        <h1>近期繁殖数</h1>
        <span class="text-xl">112</span>
      </div>
    </Card>
    <Card class="w-1/4">
      <p>猪场名称：人民公社猪场</p>
      <p>地址：湖北省武汉市新洲区汉施路1000号</p>
      <p>所有者：杨某</p>
      <p>联系电话：189XXXXXXXX</p>
    </Card>
  </div>
  <Card class="mx-4">
    <div id="charts" class="w-full h-80"></div>
  </Card>
</template>

<style lang="less">
.small-title {
  width: 33.33%;
  float: left;
  text-align: center;
  margin: 10px 0;
  transition: all 0.3s linear;
  &:hover {
    color: skyblue;
  }
  h1 {
    font-weight: 700;
  }
}
</style>
