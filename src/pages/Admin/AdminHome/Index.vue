<script setup>
import { ref, onMounted } from "vue";
import BranchService from "../../../services/branch.service";
import RoomService from "../../../services/room.service";
import UserService from "../../../services/users.service";
import CourseService from "../../../services/course.service";
import GroupService from "../../../services/groups.service";
import ReportService from "../../../services/report.service";
import {
  Branch24Filled as BranchIcon,
  ConferenceRoom24Filled as roomIcon,
  PersonAccounts24Filled as EmployeeIcon,
  ChartMultiple24Regular as KassaIcon
} from "@vicons/fluent";
import {
  PlayLessonRound as LessonIcon,
  PeopleAltFilled as GroupIcon,
} from "@vicons/material";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import { Education as StudentIcon } from "@vicons/carbon";
import BarChart from "../../../components/Charts/Bar/Bar.vue";
//// get length

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const time_def = ref(new Date());
const thisMonth = ref(
  new Date(time_def.value.getFullYear(), time_def.value.getMonth())
);
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);

const kassaEndTotal = ref(0);
const reportData = ref({
  branchLength: 0,
  roomLength: 0,
  teacherLength: 0,
  studentLength: 0,
  groupLength: 0,
  courseLength: 0,
});

const getUsers = (role) => {
  const senData = {
    id: null,
    role: role,
    filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  };
  UserService.getAll(senData).then((res) => {
    if (role == "User") {
      reportData.value.studentLength = res.length;
    } else if (role == "Teacher") {
      reportData.value.teacherLength = res.length;
    }
  });
};

const getByBranch = ref({
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
});

const getAllKassa = () => {
  let sendData = {
    filial_id: findBranch.value,
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
  };
  ReportService.kassaSverka(sendData).then((res) => {
    kassaEndTotal.value = res.end_total;
  });
};

onMounted(() => {
  BranchService.getAll().then((res) => {
    reportData.value.branchLength = res.length;
  });
  RoomService.searchModel(getByBranch.value).then((res) => {
    reportData.value.roomLength = res.length;
  });
  getUsers("User");
  getUsers("Teacher");
  GroupService.searchModel(getByBranch.value).then((res) => {
    reportData.value.groupLength = res.length;
  });
  CourseService.searchModel(getByBranch.value).then((res) => {
    reportData.value.courseLength = res.length;
  });
  getAllKassa();
});
const showModal = ref(false);
const modalTitle = ref("");
const data = ref([]);
const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return data.value.findIndex((item) => item.id == row.id) + 1;
    },
  },
  {
    title: "Nomi",
    key: "name",
  },
]);
const OpenModel = (id) => {
  showModal.value = true;

  if (id == 1) {
    modalTitle.value = "Filiallar";
    BranchService.getAll().then((res) => {
      data.value = res;
    });
  } else if (id == 2) {
    modalTitle.value = "Xonalar";
    RoomService.searchModel(getByBranch.value).then((res) => {
      data.value = res;
    });
  } else if (id == 3) {
    modalTitle.value = "O'qituvchilar";
    const senData = {
      id: null,
      role: "Teacher",
      filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
    };
    UserService.getAll(senData).then((res) => {
      data.value = res;
      columns.value[1].key = "fullname";
      columns.value[1].title = "F.I.O";
    });
  } else if (id == 4) {
    modalTitle.value = "Talabalar";
    const senData = {
      id: null,
      role: "User",
      filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
    };
    UserService.getAll(senData).then((res) => {
      data.value = res;
      columns.value[1].key = "fullname";
      columns.value[1].title = "F.I.O";
    });
  } else if (id == 5) {
    modalTitle.value = "Kurslar";
    CourseService.searchModel(getByBranch.value).then((res) => {
      data.value = res;
    });
  } else if (id == 6) {
    modalTitle.value = "Guruhlar";
    GroupService.searchModel(getByBranch.value).then((res) => {
      data.value = res;
    });
  }
  columns.value[0].key = "id";
  columns.value[0].title = "№";
  columns.value[1].key = "name";
  columns.value[1].title = "Nomi";
};
const exitAction = () => {
  showModal.value = false;
};
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-charts">
        <BarChart :data="reportData"></BarChart>
      </div>

      <n-grid cols="1 s:2 m:3 l:4" responsive="screen" :x-gap="12" :y-gap="12">
        <n-grid-item>
          <div class="simple-card status-kassa">
            <div class="simple-card-header">
              <h2>Kassa</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <KassaIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :from="0.0"
                    :to="kassaEndTotal"
                    :precision="2"
                    locale="ru-RU"
                    show-separator
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item v-if="findRole == 'SuperAdmin'">
          <div class="simple-card status-branch" v-wave @click="OpenModel(1)">
            <div class="simple-card-header">
              <h2>Filiallar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <BranchIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.branchLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item>
          <div class="simple-card status-room" v-wave @click="OpenModel(2)">
            <div class="simple-card-header">
              <h2>Xonalar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <roomIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.roomLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item>
          <div class="simple-card status-teacher" v-wave @click="OpenModel(3)">
            <div class="simple-card-header">
              <h2>O'qituvchilar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <EmployeeIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.teacherLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item>
          <div class="simple-card status-student" v-wave @click="OpenModel(4)">
            <div class="simple-card-header">
              <h2>Talabalar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <StudentIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.studentLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item>
          <div class="simple-card status-course" v-wave @click="OpenModel(5)">
            <div class="simple-card-header">
              <h2>Kurslar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <LessonIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.courseLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>

        <n-grid-item>
          <div class="simple-card status-group" v-wave @click="OpenModel(7)">
            <div class="simple-card-header">
              <h2>Guruhlar</h2>
            </div>
            <div class="simple-card-content">
              <div class="simple-card-content_item">
                <n-icon size="24">
                  <GroupIcon />
                </n-icon>
              </div>
              <div class="simple-card-content_item">
                <n-statistic tabular-nums>
                  <n-number-animation
                    :duration="4000"
                    :from="0"
                    :to="reportData.groupLength"
                    :active="true"
                    :precision="0"
                  />
                </n-statistic>
              </div>
            </div>
          </div>
        </n-grid-item>
      </n-grid>
    </div>
  </div>
  <!-- Get All Models -->
  <section>
    <n-modal
      :title="modalTitle"
      style="max-width: 900px; width: calc(100% - 35px)"
      v-model:show="showModal"
      class="custom-card"
      preset="card"
    >
      <n-data-table
        :columns="columns"
        :data="data"
        :max-height="500"
        :bordered="true"
        :single-line="false"
      />
      <template #footer>
        <div class="flex-end">
          <n-button @click="exitAction" type="warning">
            <template #icon>
              <exit-icon />
            </template>
            Chiqish
          </n-button>
        </div>
      </template>
    </n-modal>
  </section>
</template>

<style>
.n-statistic .n-statistic-value .n-statistic-value__content {
  color: #fff;
}
.flex-end {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
.box-reports {
  max-width: 350px;
  cursor: pointer;
  margin: 8px 0px;
}
.box-chart {
  height: calc(100vh - 130px);
  overflow: hidden;
  overflow-y: auto;
}
</style>
