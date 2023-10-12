<script setup>
import { ref, onMounted, reactive  } from "vue";
import ModelService from "../../../services/salary.service";

const Getdata = ref([]);
const loading = ref(true);

const getSalarys = () => {
  loading.value = true;
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
    title: "Xodim",
    key: "user.fullname",
    resizable: true,
    sortOrder:true,
    sorter:(row1, row2) => row1.user.id - row2.user.id,
  },
  {
    title: "Oylik turi",
    key: "price_type",
    resizable: true,
    sortOrder:true,
    sorter:"default",
    render(row) {
      if (row.price_type == "Monthly") {
        return "Oylik";
      } else {
        return "Foizlik";
      }
    },
  },
  {
    title: "Oylik",
    sortOrder:true,
    align:'right',
    sorter:"default",
    render(row) {
      if (row.price_type == "Monthly") {
        return  new Intl.NumberFormat('ru-RU',{
          style:'decimal'
        }).format(row.salary) ;
      } else {
        return 0;
      }
    },
  },
  {
    title: "Foizlik",
    sortOrder:true,
    align:'right',
    sorter:"default",
    render(row) {
      if (row.price_type != "Monthly") {
        return `${row.salary}%`;
      } else {
        return 0;
      }
    },
  },
  {
    title: "Filial",
    key: "branch.name",
    sortOrder:true,
  },
]);


onMounted(() => {
  getSalarys(); 
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
        <div class="box-header_item">
          <h2>Ish haqqim</h2>
        </div>
      </div>

    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="Getdata"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 800px"
        max-height="calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  
</template>

