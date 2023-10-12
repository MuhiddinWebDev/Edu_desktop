<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import CourseService from "../../../services/course.service";
import { useReportData } from "../../../stores/report";
//// report variables
const reportAct = useReportData();
const courseId = ref(null);

const findRole = ref(localStorage.getItem("role"));
const branchId = ref(JSON.parse(localStorage.getItem("filial_id")));

const branchOption = ref([]);
const courseOptions = ref([]);
const router = useRouter();
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

const getAllCourses = (branch) => {
  let sendData = {
    filial_id: branch ? branch : branchId.value,
  };
  CourseService.searchModel(sendData).then((res) => {
    courseOptions.value = res;
  });
};
const time_def = ref(new Date());
const thisMonth = ref(
  new Date(time_def.value.getFullYear(), time_def.value.getMonth())
);
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);
///// table veribles
const loading = ref(false);
const reportData = ref([]);
const dayJS = inject("dayJS");
///// table veribles
onMounted(() => {
  getAllBranches();
  getAllCourses();
  if (reportAct.courseSverka.show) {
    let el = reportAct.courseSverka;
    range_date.value = el.range_date;
    courseId.value = el.course_id;
    branchId.value = el.filial_id;
    showReport();
    el.show = false;
  }
});
const UpdateBranch = (branch) => {
  getAllCourses(branch);
};
const showReport = () => {
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    course_id: courseId.value,
    filial_id: branchId.value,
  };
  loading.value = true;
  ReportService.courseSverka(sendData).then((res) => {
    reportData.value = res;
    loading.value = false;
  });
};

const rowProps = (row) => {
  if (row.doc_type == "Chiqim") {
    reportAct.teacherPass = {
      id: row.doc_id,
      read: true,
    };
    router.push({ path: "/payment-teacher" });
  } else if (row.doc_type == "Kirim") {
    reportAct.studentPass = {
      id: row.doc_id,
      read: true,
    };
    router.push({ path: "/payment-students" });
  }
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Kurs sverka</h2>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Sana</n-input-group-label>
            <n-date-picker
              v-model:value="range_date"
              type="daterange"
              :style="{ width: '100%' }"
              clearable
            />
          </n-input-group>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              @update:value="UpdateBranch"
              :options="branchOption"
              v-model:value="branchId"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Kurs</n-input-group-label>
            <n-select
              :options="courseOptions"
              v-model:value="courseId"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-button @click="showReport" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-table
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1220px"
      >
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th class="col-same">Sana</th>
            <th>Nomi</th>
            <th>Kurs</th>
            <th>To'lov turi</th>
            <th>Izoh</th>
            <th class="color-black background-success col-same">Kirim</th>
            <th class="color-black background-error col-same">Chiqim</th>
          </tr>
        </thead>
        <tbody class="table-scroll">
          <tr>
            <td class="text-center text-bold" colspan="6">
              Boshlang'ich qoldiq
            </td>
            <td class="text-center text-bold" colspan="2">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.begin_total ? reportData.begin_total : 0)
              }}
            </td>
          </tr>
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td class="text-center" style="width: 50px">{{ index + 1 }}</td>
            <td class="col-same">
              {{ dayJS(item.datetime * 1000).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>
              {{
                item.doc_id
                  ? " № " + item.doc_id + " " + item.doc_type
                  : item.doc_type
              }}
            </td>
            <td>{{ item.course ? item.course.name : "" }}</td>
            <td>{{ item.pay_type ? item.pay_type.name : "" }}</td>
            <td>
              {{ item.comment }}
            </td>
            <td class="text-right color-black background-success col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.kirim)
              }}
            </td>

            <td class="text-right color-black background-error col-same">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.chiqim)
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="6">Jami</td>
            <td
              class="text-right text-bold color-black background-success col-same"
            >
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_kirim ? reportData.total_kirim : 0)
              }}
            </td>

            <td
              class="text-right text-bold color-black background-error col-same"
            >
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_chiqim ? reportData.total_chiqim : 0)
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="6">Yakuniy qoldiq</td>
            <td class="text-center text-bold" colspan="2">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.end_total ? reportData.end_total : 0)
              }}
            </td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<style>
.report-data-row {
  cursor: pointer;
}

.box-table {
  max-height: calc(100vh - 190px);
  overflow: hidden;
  overflow: auto;
}

.report-empty {
  padding: 20px;
}

.col-same {
  width: 200px !important;
}
</style>
