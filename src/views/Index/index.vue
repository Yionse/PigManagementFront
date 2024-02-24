<script setup>
import { onMounted, watchEffect, ref } from "vue";
import { Card } from "ant-design-vue";
import * as echarts from "echarts";
import { getBreed, getPigList } from "../../apis/pig";
import { getDoctorList } from "../../apis/doctor";
import { getBreedingList } from "../../apis/breedingRecord";
import { getHealthList } from "../../apis/health";

const { data: pigData } = getPigList();
const { data: type } = getBreed();
const { data: doctor } = getDoctorList();
const { data: breeding } = getBreedingList();
const { data: healthList } = getHealthList();

const newPigstyData = ref([]);

watchEffect(() => {
  if (pigData.value) {
    newPigstyData.value = pigData.value.pigsty;

    const chartDom = document.getElementById("charts");
    const myChart = echarts.init(chartDom);
    console.log(newPigstyData);
    const option = {
      title: {
        text: "人民公社猪场种猪分布情况图",
        textStyle: {
          fontSize: 16,
          fontWeight: "bold",
        },
        left: "center", // 标题居中显示
      },
      xAxis: {
        type: "category",
        data: newPigstyData.value.map((item) => item.pigstyName),
        axisLabel: {
          interval: 0, // 设置为0，强制显示所有标签
        },
      },
      yAxis: {
        type: "value",
      },
      series: [
        {
          data: newPigstyData.value?.map((item) => item.currentPopulation),
          type: "bar",
          label: {
            show: true, // 显示标签
            position: "top", // 标签位置（可根据需要调整）
          },
        },
      ],
    };
    myChart.setOption(option);
  }
});

onMounted(() => {
  // 其他初始化逻辑，如果有的话
});
</script>

<template>
  <div class="flex flex-row justify-between p-4">
    <Card class="w-2/3">
      <div class="small-title">
        <h1>种猪数量</h1>
        <span class="text-xl">{{
          pigData?.pig.filter((item) => item.exitDate === null).length
        }}</span>
      </div>
      <div class="small-title">
        <h1>猪舍数量</h1>
        <span class="text-xl">{{ pigData?.pigsty.length }}</span>
      </div>
      <div class="small-title">
        <h1>品种数量</h1>
        <span class="text-xl">{{ type?.length }}</span>
      </div>
      <div class="small-title">
        <h1>近期病猪</h1>
        <span class="text-xl">{{ healthList?.data?.length }}</span>
      </div>
      <div class="small-title">
        <h1>在职医生数</h1>
        <span class="text-xl">{{ doctor?.data?.length }}</span>
      </div>
      <div class="small-title">
        <h1>近期繁殖次数</h1>
        <span class="text-xl">{{ breeding?.data?.length }}</span>
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
