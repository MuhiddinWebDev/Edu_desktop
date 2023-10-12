<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import ModelService from "../../../services/dayOff.service";

const days = ref([]);
const loading = ref(false);

const getAllRest = () => {
  ModelService.searchModel().then((res) => {
    days.value = res;
  });
};

const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return days.value.findIndex((item) => item.id == row.id) + 1;
    },
  },
  {
    title: "Sana",
    key: "date",
    resizable: true,
    sortOrder:true,
    sorter: "default",
  },
  {
    title: "Nomi",
    key: "name",
    resizable: true,
    sortOrder:true,
    sorter: "default",
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder:true,
    sorter: (row1,row2) => row1.branch.id - row2.branch.id,
  },
 
])

onMounted(() => {
  getAllRest();
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
      }
});
///// pagination end
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <h2>Dam olish kunlari</h2>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="days"
        :bordered="true"
        :single-line="false"
        size="small"
        >
      </n-data-table>
    </div>
  </div>

</template>


