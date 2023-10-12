<script setup>
import { ref, onMounted,reactive } from "vue";
import ModelService from "../../../services/lesson.service";
const Getdata = ref([]);
const loading = ref(true);

const getAllData = () => {
  ModelService.getAll().then((res) => {
    Getdata.value = res;
    loading.value = false;
  });
};

const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return Getdata.value.findIndex((item) => item.id == row.id) + 1;
    },
  },
  {
    title: "Guruh",
    key: "group.name",
    resizable: true,
  },
  {
    title: "Kurs",
    key: "course.name",
    resizable: true,
  },
  {
    title: "O'qituvchi",
    key: "course.teachers.fullname",
    resizable: true,
  },
  {
    title: "Xona",
    key: "room.name",
    resizable: true,
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
  },
 
]);

onMounted(() => {
  getAllData();
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
          <h2>Darslarim</h2>
        </div>
     
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="Getdata"
        :bordered="true"
        :single-line="false"
        style="min-width: 950px"
        size="small"
        max-height="calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  
</template>
