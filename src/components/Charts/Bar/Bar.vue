<script setup>
import * as echarts from "echarts";
import { use } from "echarts/core";
import { CanvasRenderer } from "echarts/renderers";
import { PieChart } from "echarts/charts";
import {
  TitleComponent,
  TooltipComponent,
  LegendComponent,
} from "echarts/components";
import VChart, { THEME_KEY } from "vue-echarts";
import { ref, provide, watch, onMounted, inject } from "vue";
import ReportService from "../../../services/report.service";
import { useCounterStore } from "../../../stores/counter";
use([
  CanvasRenderer,
  PieChart,
  TitleComponent,
  TooltipComponent,
  LegendComponent,
]);
const counter = useCounterStore();
const autoTheme = ref("dark");
const dayJS = inject("dayJS");
const props = defineProps(["data"]);

provide(THEME_KEY, autoTheme);

watch(
  () => counter.theme,
  (val) => {
    if (val) {
      autoTheme.value = "dark";
    } else {
      autoTheme.value = "light";
    }
  }
);

const getAllReports = async (data) => {
  let kirimData = [];
  let chiqimData = [];
  let dataDays = [];
  await ReportService.kassaSverka(data).then((res) => {
    for (let i = 0; i < res.data.length; i++) {
      let el = res.data[i];
      kirimData.push(el.kirim);
      chiqimData.push(el.chiqim);
      dataDays.push(dayJS(el.datetime * 1000).format('YYYY-MM-DD'))
    }
    option.value.series[0].data = kirimData;
    option.value.series[1].data = chiqimData;
    option.value.xAxis[0].data = dataDays;
  });
 
};

const option = ref({
  tooltip: {
    trigger: "axis",
    axisPointer: {
      type: "cross",
      crossStyle: {
        color: "#000",
      },
    },
  },
  toolbox: {
    feature: {
      dataView: { show: true, readOnly: false },
      magicType: { show: true, type: ["line", "bar"] },
      restore: { show: true },
      saveAsImage: { show: true },
    },
  },
  legend: {
    data: ["Kirim", "Chiqim"],
  },
  xAxis: [
    {
      type: "category",
      data: [],
      axisPointer: {
        type: "shadow",
      },
    },
  ],
  yAxis: [
    {
      type: "value",
      name: "Kassa",
      min: 0,
      max: 10000000,
      interval: 1000000,
      axisLabel: {
        formatter: "{value} so'm",
      },
    },
  ],
  series: [
    {
      name: "Kirim",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " so'm";
        },
      },
      data: [],
    },
    {
      name: "Chiqim",
      type: "bar",
      tooltip: {
        valueFormatter: function (value) {
          return value + " so'm";
        },
      },
      data: [],
    },
  ],
});

// const option2 = ref({
//   tooltip: {
//     trigger: "item",
//   },
//   legend: {
//     orient: "horizontal",
//     top: "5%",
//     left: "center",
//   },
//   series: [
//     {
//       name: "Kassa",
//       type: "pie",
//       radius: ["40%", "70%"],
//       avoidLabelOverlap: false,
//       itemStyle: {
//         borderRadius: 15,
//         borderColor: "#ccc",
//         borderWidth: 1,
//       },
//       label: {
//         fontSize: 15,
//         fontWeight: "bold",
//       },
//       data: [
//         { value: 0, name: "Kassa" },
//         { value: 735, name: "Xarajat" },
//         { value: 580, name: "Talaba" },
//         { value: 484, name: "O'qituvchi" },
//         { value: 300, name: "Kurs" },
//       ],
//       emphasis: {
//         itemStyle: {
//           shadowBlur: 10,
//           shadowOffsetX: 0,
//           shadowColor: "rgba(0, 0, 0, 0.5)",
//         },
//         label: {
//           show: true,
//           fontSize: 40,
//           fontWeight: "bold",
//         },
//       },
//     },
//   ],
// });

const days = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth() + 1;

  const thisMonth = new Date(today.getFullYear(), today.getMonth());
  const range_date = [thisMonth.getTime(), today.getTime()];
  
  let sendData = {
    start_date: Math.floor(range_date[0] / 1000),
    end_date: Math.floor(range_date[1] / 1000),
    filial_id: JSON.parse(localStorage.getItem("filial_id")),
    pay_type_id: null,
  };

  const lastDayOfMonth = new Date(year, month, 0);
  const daysInMonth = lastDayOfMonth.getDate();
  // for(let i = 1; i <= daysInMonth; i++){
    // let el = dayJS(new Date(year, month -1 , i).getTime()).format("YYYY-MM-DD");
    // option.value.xAxis[0].data.push(el)
  // }

  getAllReports(sendData);
};
onMounted(async () => {
  await days();
  if (counter.theme) {
    autoTheme.value = "dark";
  } else {
    autoTheme.value = "light";
  }
  counter.theme = JSON.parse(localStorage.getItem("theme"));
});
</script>
<template>
  <div class="d-grid">
    <div class="d-grid-item">
      <v-chart class="chart" :option="option" autoresize></v-chart>
    </div>
    <!-- <div class="d-grid-item">
      <v-chart class="chart" :option="option2" autoresize></v-chart>
    </div> -->
  </div>
</template>
<style scoped>
.chart {
  height: 500px;
  margin: 10px 0px;
}
.d-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(320px, 1fr));
}
</style>
