<script setup>
import { ref, onMounted, inject, watch } from "vue";
import ModelService from "../../../services/lesson.service";
import BranchService from "../../../services/branch.service";

import { useMagicKeys } from "@vueuse/core";
import {
  ChevronRight16Filled as rightArrow,
  ChevronLeft16Filled as leftArrow,
} from "@vicons/fluent";
const dayJS = inject("dayJS");
const today = ref(new Date());
const dayOfWeek = ref(null);
const monday = ref(null);
const saturday = ref(null);
const startWeek = ref(today.value.getTime());
const endWeek = ref(today.value.getTime());
const branchOptions = ref([]);
const loading = ref(true);
const lessonTable = ref([]);
const branchName = ref('')
const findRole = ref( localStorage.getItem('role'));
const findBranch = ref(JSON.parse(localStorage.getItem('filial_id')));

const MondayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const TuesdayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const WednesdayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const ThursdayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const FridayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const SaturdayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});
const SundayData = ref({
  weekday: "",
  date: "",
  data_table: [],
});

const clearData = () => {
  MondayData.value.data_table = [];
  TuesdayData.value.data_table = [];
  WednesdayData.value.data_table = [];
  ThursdayData.value.data_table = [];
  FridayData.value.data_table = [];
  SaturdayData.value.data_table = [];
  SundayData.value.data_table = [];
};
const getAll = (start, end, branch) => {
  loading.value = true
  clearData();
  const data_table ={
    start: start,
    end: end,
    filial_id:branch
  }
  ModelService.getAllTable(data_table).then((res) => {
    lessonTable.value = res;
    loading.value = false;
    res.forEach((item) => {
      if (item.weekday == "Monday") {
        MondayData.value.weekday = item.weekday;
        MondayData.value.date = item.date;
        MondayData.value.data_table.push(item);
      } else if (item.weekday == "Tuesday") {
        TuesdayData.value.weekday = item.weekday;
        TuesdayData.value.date = item.date;
        TuesdayData.value.data_table.push(item);
      } else if (item.weekday == "Wednesday") {
        WednesdayData.value.weekday = item.weekday;
        WednesdayData.value.date = item.date;
        WednesdayData.value.data_table.push(item);
      } else if (item.weekday == "Thursday") {
        ThursdayData.value.weekday = item.weekday;
        ThursdayData.value.date = item.date;
        ThursdayData.value.data_table.push(item);
      } else if (item.weekday == "Friday") {
        FridayData.value.weekday = item.weekday;
        FridayData.value.date = item.date;
        FridayData.value.data_table.push(item);
      } else if (item.weekday == "Saturday") {
        SaturdayData.value.weekday = item.weekday;
        SaturdayData.value.date = item.date;
        SaturdayData.value.data_table.push(item);
      } else if (item.weekday == "Sunday") {
        SundayData.value.weekday = item.weekday;
        SundayData.value.date = item.date;
        SundayData.value.data_table.push(item);
      }
    });
  });
};
const getAllBranches = ()=>{
  BranchService.getAll().then((res)=>{
    branchOptions.value = res;
  });
}
const findBranchName = (branch)=>{
  BranchService.getOne(branch).then((res)=>{
    branchName.value = res.name;
  });
}
const currentWeek = (branch, xDate,yDate)=>{
  dayOfWeek.value = today.value.getDay();
  monday.value = new Date(today.value);
  saturday.value = new Date(monday.value);
  ////////////////////////////////
  monday.value.setDate(today.value.getDate() - dayOfWeek.value + 1);
  saturday.value.setDate(monday.value.getDate() + 6);
  ////////////////////////////////
  startWeek.value = monday.value.getTime();
  endWeek.value = saturday.value.getTime();
  let startStr = dayJS(startWeek.value).format("YYYY-MM-DD");
  let endStr = dayJS(endWeek.value).format("YYYY-MM-DD");
  getAll(startStr, endStr, branch);
}
const countWeek = ref(1);
onMounted(() => {
  currentWeek(findBranch.value);
  findBranchName(findBranch.value);
  if(findRole.value =='SuperAdmin'){
    getAllBranches();
  }
});

///// search functions starting

const ArrowClick = (e)=>{
  const startWeekDate = new Date(startWeek.value);
  const endWeekDate = new Date(endWeek.value);

  // Calculate the new start and end dates
  const newStartWeekDate = new Date(startWeekDate);
  const newEndWeekDate = new Date(endWeekDate);
  if(e == 'left'){
    newStartWeekDate.setDate(newStartWeekDate.getDate() - countWeek.value * 7);
    newEndWeekDate.setDate(newEndWeekDate.getDate() - countWeek.value * 7);
  }else{
    newStartWeekDate.setDate(newStartWeekDate.getDate() + countWeek.value * 7);
    newEndWeekDate.setDate(newEndWeekDate.getDate() + countWeek.value * 7);
  }
  startWeek.value = newStartWeekDate.getTime();
  endWeek.value = newEndWeekDate.getTime();

  let startStr = dayJS(startWeek.value).format("YYYY-MM-DD");
  let endStr = dayJS(endWeek.value).format("YYYY-MM-DD");
  let branch = findBranch.value;

  getAll(startStr, endStr, branch);
}
const updateBranch = (branch)=> {
  let startStr = dayJS(startWeek.value).format("YYYY-MM-DD");
  let endStr = dayJS(endWeek.value).format("YYYY-MM-DD");
  getAll(startStr, endStr, branch);
  findBranchName(branch)
}
/// search keydown event start
const { arrowright, arrowleft /* keys you want to monitor */ } = useMagicKeys();
watch(arrowright, (v) => {
  if (v) {
    ArrowClick('right')
  }
});
watch(arrowleft, (v) => {
  if (v) {
    ArrowClick('left')

  }
});
//// search keydown event end

</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <h2>Dars jadvali</h2>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-button @click="ArrowClick('left')" type="success">
            <template #icon>
              <n-icon>
                <leftArrow />
              </n-icon>
            </template>
          </n-button>
          <n-input-group>
            <n-input-group-label>Boshlanish sanasi</n-input-group-label>
            <n-date-picker
              :disabled="true"
              v-model:value="startWeek"
              :style="{ width: '100%' }"
            ></n-date-picker>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Tugash sanasi</n-input-group-label>
            <n-date-picker
              :disabled="true"
              v-model:value="endWeek"
              :style="{ width: '100%' }"
            ></n-date-picker>
          </n-input-group>
          <n-button @click="ArrowClick('right')" type="success">
            <template #icon>
              <n-icon>
                <rightArrow />
              </n-icon>
            </template>
          </n-button>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              v-model:value="findBranch"
              :options="branchOptions"
              @update:value = "updateBranch"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>
      </div>
    </div>
    <n-spin :show="loading">
      <h2 style="padding:4px 20px">{{ branchName }} dars jadvali</h2>
      <div class="box-table" :class="lessonTable.length == 0 ? 'box-table_active' : ''">
        <div class="box-table_item" v-if="MondayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ MondayData.date }}
            </template>
            <template #header>
              <p v-if="MondayData.weekday == 'Monday'">Dushanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in MondayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="TuesdayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ TuesdayData.date }}
            </template>
            <template #header>
              <p>Seshanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in TuesdayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="WednesdayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ WednesdayData.date }}
            </template>
            <template #header>
              <p>Chorshanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in WednesdayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="ThursdayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ ThursdayData.date }}
            </template>
            <template #header>
              <p>Payshanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in ThursdayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="FridayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ FridayData.date }}
            </template>
            <template #header>
              <p>Juma</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in FridayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="SaturdayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ SaturdayData.date }}
            </template>
            <template #header>
              <p>Shanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in SaturdayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_item" v-if="SundayData.data_table.length > 0">
          <n-card :style="{ height: '100%' }" :bordered="false" size="small">
            <template #header-extra>
              {{ SundayData.date }}
            </template>
            <template #header>
              <p>Yakshanba</p>
            </template>
            <n-divider :style="{ margin: '4px 0px' }"></n-divider>
            <div class="time-table">
              <div
                class="time-table-content"
                v-for="(item, index) in SundayData.data_table"
              >
                <div class="time-table-content_title">
                  <p>
                    {{ index + 1 }}. <span>{{ item.course_name }}</span>
                  </p>
                  <n-tag
                    :bordered="false"
                    round
                    :color="{ color: '#18a058', textColor: '#fff' }"
                  >
                    {{ item.group_name }}
                  </n-tag>
                </div>
                <div class="time-table-content_item">
                  <p>{{ item.room_name }}</p>
                  <p>/</p>
                  <p :title="item.teacher_name">{{ item.teacher_name }}</p>
                  <p>/</p>
                  <p>{{ item.begin_date }} - {{ item.end_date }}</p>
                </div>
              </div>
            </div>
          </n-card>
        </div>

        <div class="box-table_empty" v-if="lessonTable.length == 0">
          <n-empty description="Bu oraliqda dars jadvali mavjud emas">
          </n-empty>
        </div>
      </div>
    </n-spin>
  </div>
</template>

<style scoped>
.time-table-content_title {
  display: flex;
  align-items: center;
  justify-content: space-between;
}
.search-action_item {
  display: flex;
  align-items: center;
  gap: 8px;
}

.header-text {
  margin-right: 12px;
}

.header_item {
  display: flex;
  align-items: center;
  gap: 6px;
}

.header-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}

.box-table_item {
  cursor: pointer;
  padding: 4px;
  box-shadow: rgba(0, 0, 0, 0.15) 0px 5px 15px 0px;
  border-radius: 7px;
}

.box-table {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 8px 12px;
}

.box-table_active {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
