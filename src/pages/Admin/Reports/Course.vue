<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import CourseService from "../../../services/course.service";
import { useReportData } from "../../../stores/report";
//// report variables
const coursePass = useReportData()
const courseId = ref(null);

const filterOption = ref({
  course_id:null,
  type: null,
  filial_id:JSON.parse(localStorage.getItem("filial_id")),
})
const findRole = ref(localStorage.getItem("role"));
const branchId = ref(JSON.parse(localStorage.getItem("filial_id")));

const typeOption = ref([
  {
    type:1,
    name:"Kirim"
  },
  {
    type:0,
    name: "Chiqim"
  }
])
const branchOption = ref([]);
const courseOptions = ref([]);
const router = useRouter();
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

const getAllCourses = (branch) => {
  CourseService.searchModel(filterOption.value).then((res) => {
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
});
const UpdateBranch = (branch) => {
  getAllCourses(branch);
};
const showEmpty = ref(false);
const showReport = () => {
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    filial_id: filterOption.value.filial_id,
    course_id:filterOption.value.course_id,
    type: filterOption.value.type
  };
  loading.value = true;
  ReportService.courseReport(sendData).then((res) => {
    reportData.value = res;
    loading.value = false;
    if (res.data.length > 0) {
      showEmpty.value = true;
    }
  });
};

const rowProps = (row) => {
  coursePass.courseSverka = {
    range_date: range_date.value,
    course_id: row.course.id,
    filial_id: filterOption.value.filial_id,
    type: filterOption.value.type,
    show: true,
  }
  router.push({path:"/sverka-course"})
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Kurs hisoboti</h2>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Sana</n-input-group-label>
            <n-date-picker
              v-model:value="range_date"
              type="daterange"
              :style="{width:'100%'}"
            />
          </n-input-group>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              @update:value="UpdateBranch"
              :options="branchOption"
              v-model:value="filterOption.filial_id"
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
              v-model:value="filterOption.course_id"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Turi</n-input-group-label>
            <n-select
              :options="typeOption"
              v-model:value="filterOption.type"
              label-field="name"
              value-field="type"
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
      <n-table :bordered="true" :single-line="false" size="small" style="min-width: 1020px;">
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th>Kurs</th>
            <th class="col-same">Boshlang'ich qoldiq</th>
            <th class="color-black background-success col-same" >Kirim</th>
            <th class="color-black background-error col-same" >Chiqim</th>
            <th class="col-same"> Oxirgi qoldiq</th>
          </tr>
        </thead>
        <tbody class="table-scroll">
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td class="text-center" style="width: 50px">{{ index + 1 }}</td>
            <td>{{ item.course ? item.course.name : "" }}</td>
            <td class="text-right " :class="item.begin_total >= 0 ? 'status-success':'status-error'">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.begin_total)
              }}
            </td>
            <td class="text-right color-black background-success">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.kirim)
              }}
            </td>
          
            <td class="text-right color-black background-error">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.chiqim)
              }}
            </td>
            <td class="text-right " :class="item.end_total >= 0 ? 'status-success':'status-error'"  >
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.end_total)
                
              }}
            </td>

            
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="2">Jami</td>
            <td class="text-right text-bold ">{{ new Intl.NumberFormat('ru-RU',{
                style:'decimal',
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }).format( reportData.total_begin ? reportData.total_begin: 0) }}</td>
            <td class="text-right text-bold color-black background-success">{{ new Intl.NumberFormat('ru-RU',{
                style:'decimal',
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }).format( reportData.total_kirim ? reportData.total_kirim : 0) }}</td>
       
            <td class="text-right text-bold color-black background-error">{{ new Intl.NumberFormat('ru-RU',{
                style:'decimal',
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }).format( reportData.total_chiqim ? reportData.total_chiqim: 0) }}</td>
            <td class="text-right text-bold ">{{ new Intl.NumberFormat('ru-RU',{
                style:'decimal',
                minimumFractionDigits:2,
                maximumFractionDigits:2,
            }).format( reportData.total_end ? reportData.total_end: 0) }}</td>
          
          </tr>
        </tbody>
      </n-table>
      
    </div>
  </div>
</template>

<style scoped>
.report-data-row {
  cursor: pointer;
}

.report-empty {
  padding: 20px;
}
</style>
