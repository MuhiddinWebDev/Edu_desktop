<script setup>
import {ref, onMounted, inject, reactive } from "vue";
import ModelService from "../../../services/teacherSalary.service";

const dayJS = inject("dayJS");
const Data = ref([]);
const loading = ref(true);

const getTeacherMonth = () => {
  loading.value = true;
  ModelService.searchModel().then((res) => {
    Data.value = res;
    loading.value = false;
  });
};

const columns = ref([
  {
    title: "№",
    key: "id",
    width: 50,
    align: "center",
  },
  {
    title: "Sanasi",
    key: "datetime",
    resizable: true,
    render(row) {
      return dayJS(row.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "O'qituvchi",
    key: "teacher.fullname",
    resizable: true,
  },

  {
    title: "Kurs",
    key: "course.name",
    resizable: true,
  },
  {
    title: "Kurs narxi",
    key: "course_price",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.course_price);
    },
  },

  {
    title: "Talaba soni",
    key: "student_count",
    resizable: true,
  },
  {
    title: "Oyligim",
    key: "all_sum",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.all_sum);
    },
  },

  {
    title: "To'landi",
    key: "pay_summa",
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.pay_summa);
    },
  },
  {
    title: "Filial",
    key: "filial.name",
    resizable: true,
  },
  {
    title: "Izoh",
    key: "comment",
    resizable: true,
  },
]);

onMounted(() => {
  getTeacherMonth();
});



///// pagination start
const pagination = reactive({
  page: 1,
  pageSize: 10,
  showSizePicker: true,
  pageSizes: [10, 15, 20],
  onChange: (page) => {
    pagination.page = page;
  },
  onUpdatePageSize: (pageSize) => {
    pagination.pageSize = pageSize;
    pagination.page = 1;
  },
});
///// pagination end
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Oyliklarim</h2>
        </div>
     
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="Data"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1200px"
        max-height="calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  
</template>

<style scoped></style>
