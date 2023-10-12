<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import UsersService from "../../../services/users.service";
import { useReportData } from "../../../stores/report";
//// report variables
const sverkaPass = useReportData();
const studentId = ref(null);

const findRole = ref(localStorage.getItem("role"));
const branchId = ref(JSON.parse(localStorage.getItem("filial_id")));

const branchOption = ref([]);
const studentOptions = ref([]);
const router = useRouter();

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

const getAllStudents = (branch) => {
  let sendData = {
    filial_id: branch ? branch : branchId.value,
    role: "User",
  };
  UsersService.getAll(sendData).then((res) => {
    studentOptions.value = res;
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
  getAllStudents();
});
const UpdateBranch = (branch) => {
  getAllStudents(branch);
};
const showReport = () => {
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    student_id: studentId.value,
    filial_id: branchId.value,
  };
  loading.value = true;
  ReportService.studentReport(sendData).then((res) => {
    reportData.value = res;
    console.log(res)
    loading.value = false;
  });
};

const rowProps = (row) => {
  sverkaPass.studentSverka = {
    range_date: range_date.value,
    student_id: row.user.id,
    filial_id: branchId.value,
    show: true,
  };
  router.push({ path: "/sverka-student" });
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Talaba hisoboti</h2>
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
            <n-input-group-label>Talaba</n-input-group-label>
            <n-select
              :options="studentOptions"
              v-model:value="studentId"
              label-field="fullname"
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
        style="min-width: 1420px"
      >
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th>Talaba</th>
            <th>Guruh</th>
            <th>Kurs</th>
            <th class="col-same">Boshlang'ich qoldiq</th>
            <th class="color-black background-success col-same">Kirim</th>
            <th class="color-black background-warning col-same">Chegirma</th>
            <th class="color-black background-error col-same">Chiqim</th>
            <th class="col-same">Oxirgi qoldiq</th>
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

            <td>{{ item.user ? item.user.fullname : "" }}</td>
            <td>{{ item.group ? item.group.name : "" }}</td>
            <td>{{ item.course ? item.course.name : "" }}</td>
            <td class="text-right">
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
            <td class="text-right color-black background-warning">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(item.discount)
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
            <td class="text-right">
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
            <td class="text-center text-bold" colspan="4">Jami</td>
            <td class="text-right text-bold">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_begin ? reportData.total_begin : 0)
              }}
            </td>
            <td class="text-right text-bold color-black background-success">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_kirim ? reportData.total_kirim : 0)
              }}
            </td>
            <td class="text-right text-bold color-black background-warning">
              {{
                new Intl.NumberFormat("ru-Ru", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(
                  reportData.total_discount ? reportData.total_discount : 0
                )
              }}
            </td>
            <td class="text-right text-bold color-black background-error">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_chiqim ? reportData.total_chiqim : 0)
              }}
            </td>
            <td class="text-right text-bold">
              {{
                new Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                  maximumFractionDigits: 2,
                }).format(reportData.total_end ? reportData.total_end : 0)
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
</style>
