<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import BranchService from "../../../services/branch.service";
import GroupsService from "../../../services/groups.service";
import UsersService from "../../../services/users.service";
import { useReportData } from "../../../stores/report";
//// report variables
const reportAct = useReportData();
const teacherId = ref(null);

const findRole = ref(localStorage.getItem("role"));
const branchId = ref(JSON.parse(localStorage.getItem("filial_id")));

const groupId = ref(null);
const branchOption = ref([]);
const teacherOptions = ref([]);
const groupsOptions = ref([]);
const router = useRouter();

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const getAllGroups = (branch) => {
  let sendData = {
    filial_id: branch ? branch : branchId.value,
  };
  GroupsService.searchModel(sendData).then((res) => {
    groupsOptions.value = res;
  });
};
const getAllTeacher = (branch) => {
  let sendData = {
    filial_id: branch ? branch : branchId.value,
    role: "Teacher",
  };
  UsersService.getAll(sendData).then((res) => {
    teacherOptions.value = res;
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
  getAllTeacher();
  getAllGroups();
  if (reportAct.lessonSverka.show) {
    let el = reportAct.lessonSverka;
    range_date.value = el.range_date;
    teacherId.value = el.teacher_id;
    groupId.value = el.group_id;
    branchId.value = el.filial_id;
    showReport();
    el.show = false;
  }
});
const UpdateBranch = (branch) => {
  getAllTeacher(branch);
  getAllGroups(branch);
};
const showReport = () => {
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    group_id: groupId.value,
    teacher_id: teacherId.value,
    filial_id: branchId.value,
  };
  loading.value = true;
  ReportService.lessonSverka(sendData).then((res) => {
    reportData.value = res;
    loading.value = false;
  });
};

const rowProps = (row) => {};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Dars sverka</h2>
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
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              :options="groupsOptions"
              v-model:value="groupId"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>O'qituvchi</n-input-group-label>
            <n-select
              :options="teacherOptions"
              v-model:value="teacherId"
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
        style="min-width: 1020px"
      >
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th>Sana</th>
            <th>Dars nomi</th>
            <th>Guruh</th>
            <th>Kurs</th>
            <th>O'qituvchi</th>
            <th>O'tildi</th>
            <!-- <th>O'tilmadi</th> -->
          </tr>
        </thead>
        <tbody class="table-scroll">
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td style="width: 50px">{{ index + 1 }}</td>
            <td>{{ item.date }} {{ item.begin_date }} - {{ item.end_date }}</td>
            <td>{{ item.name }}</td>
            <td>{{ item.group ? item.group.name : "" }}</td>
            <td>{{ item.course_name }}</td>
            <td>{{ item.teacher ? item.teacher.fullname : "" }}</td>
            <td class="text-bold">
              <p v-if="item.done_yes" class="color-success">Xa</p>
              <p v-else-if="item.done_no" class="color-error">Yo'q</p>
            </td>
            <!-- <td class=" text-bold">
                <p v-if="item.done_no" class="color-success">Xa</p>
                <p v-else  class="color-error">Yo'q</p>
            </td> -->
          </tr>
          <tr style="position: sticky; top: 0">
            <td class="text-center text-bold" colspan="6">Jami</td>
            <td class="text-bold">
              <div class="d-flex-row">
                <p class="color-success">
                  Xa: {{ reportData.all_yes ? reportData.all_yes : 0 }}
                </p>
                <p class="color-error">
                  Yo'q: {{ reportData.all_no ? reportData.all_no : 0 }}
                </p>
              </div>
            </td>
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
.d-flex-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.box-table {
  max-height: calc(100vh - 190px);
  overflow: hidden;
  overflow: auto;
}
</style>
