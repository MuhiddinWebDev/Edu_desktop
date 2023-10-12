<script setup>
import { h, ref, onMounted, inject, watch, reactive } from "vue";
import ModelService from "../../../services/course.service";

const loading = ref(true);
const img_url = inject("course_img");
const data = ref([]);

const getAllCourse = () => {
  ModelService.getAll().then((res) => {
    data.value = res;
    loading.value = false;
  });
};

const columns = ref([
  {
    title: "№",
    key: "id",
    width: 40,
    align: "center",
    render(row) {
      return data.value.findIndex((item) => item.id == row.id) + 1;
    },
  },
  {
    title: "Nomi",
    key: "name",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Kurs darjasi",
    key: "level",
    resizable: true,
    sortOrder: true,
    sorter: "default",
    render(row) {
      if (row.level == "middle") {
        return "O'rtacha";
      } else if (row.level == "junior") {
        return "Boshlang'ich";
      } else if (row.level == "senior") {
        return "Murakkab";
      }
    },
  },
  {
    title: "O'qituvchi",
    key: "teachers.fullname",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },

  {
    title: "Oylik narxi",
    key: "price_month",
    resizable: true,
    titleAlign: "center",
    align: "right",
    sortOrder: true,
    sorter: "default",
    render(row) {
      return new Intl.NumberFormat("ru-Ru", {
        style: "decimal",
      }).format(row.price_month);
    },
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder: true,
    sorter: (row1, row2) => row1.branch.id - row2.branch.id,
  },
  {
    title: "Tili",
    key: "lang",
    resizable: true,
    sortOrder: true,
    sorter: "default",
    width: 60,
    render(row) {
      return row.lang.toUpperCase();
    },
  },
  {
    title: "Rasm",
    key: "image",
    resizable: true,
    width: 140,
    render(row) {
      if (row.image != "") {
        return h(NImage, {
          height: 50,
          objectFit: "contain",
          src: img_url + row.image,
        });
      } else {
        return "Rasm yo'q";
      }
    },
  },
]);

onMounted(() => {
  getAllCourse();
});

///// end function

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
          <h2>Kurslarim</h2>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="data"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 950px"
        max-height="calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
</template>
