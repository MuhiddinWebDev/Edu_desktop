<script setup>
import { ref, onMounted, inject, h } from "vue";
import { useMessage } from "naive-ui";
import ModelService from "../../../services/lesson.service";
import GroupService from "../../../services/groups.service";
import CourseService from "../../../services/course.service";
import RoomsService from "../../../services/room.service";
import BranchService from "../../../services/branch.service";

import RoomIndex from "../Rooms/Index.vue";
import GroupIndex from "../Groups/Index.vue";
import BranchIndex from "../Branch/Index.vue";

import Dots from "../../../components/Dots/dots.vue";
import { useCounterStore } from "../../../stores/counter";
import { NAvatar, NText, NTag } from "naive-ui";
import {
  Save24Filled as SaveIcon,
  ArrowRight16Filled as rightArrow,
  AppGeneric24Filled as genericIcon,
} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import {
  AppRegistrationSharp as planIcon,
  DeleteForeverRound as delIcon,
} from "@vicons/material";

const counter = useCounterStore();
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref("");
const formTwoRef = ref("");
const showFeedback = ref(false);
const message = useMessage();
const dayJS = inject("dayJS"); // inject dayJS
const daysWrapper = ref(false);
const spinBtn = ref(false);
////// select options
const groupsOptions = ref([]);
const coursesOptions = ref([]);
const roomsOptions = ref([]);
const branchOptions = ref([]);
/////  select options
/// lesson  variables
const showLessonTable = ref(false);
const LessonTable = ref([]);
////////////////////////////////
///// choose Admin or SuperAdmin options
const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));
///////////////

const form_data = ref({
  group_id: null,
  course_id: null,
  room_id: null,
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  next_lesson: "122",
});
const genarate_date = ref({
  start_date: "",
  lesson_id: null,
  group_id: null,
  course_id: null,
  weekday: [],
});

const rules = {
  group_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos guruhni tanlang");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos filial tanlang");
      }
    },
  },
  course_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos kursni tanlang");
      }
    },
  },
  room_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos xona tanlang");
      }
    },
  },
};
const genarate_rules = {};
const roomID = ref(null);
const LessonID = ref(null);
const filterData = ref({
  filial_id: form_data.value.filial_id,
});

const getAllGroups = (branch) => {
  if(branch){
    filterData.value.filial_id = branch
  }
  ModelService.getAllGroup(filterData.value).then((res) => {
    groupsOptions.value = res
  });
};
const getAllCourse = (branch) => {
  if(branch){
    filterData.value.filial_id = branch
  }
  CourseService.searchModel(filterData.value).then((res) => {
    coursesOptions.value = res;
  });
};
const getAllRooms = (branch) => {
  if(branch){
    filterData.value.filial_id = branch
  }
  RoomsService.searchModel(filterData.value).then((res) => {
    roomsOptions.value = res;
  });
};
const getAllBranch = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};
onMounted(() => {
  if (props.type == "update") {
    if (counter.lesson == true) {
      createLesson.value = false;
      daysWrapper.value = true;
    } else {
      createLesson.value = true;
      daysWrapper.value = false;
    }
    
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      genarate_date.value.course_id = res.course_id;
      genarate_date.value.group_id = res.group_id;
      genarate_date.value.lesson_id = res.lesson_id;
      roomID.value = res.room_id;
      LessonID.value = res.id;
      LessonTable.value = res.lesson_table;
      if(res.lesson_table.length == 0){
        daysWrapper.value = true;
        counter.lesson = true;
        createLesson.value = false;
      }else{
        daysWrapper.value = false;
        counter.lesson = false;
        createLesson.value = true;
      }
    });
  }
  // if (findRole.value == "SuperAdmin") {
  //   getAllBranch();
  // }
  // if (findRole.value != "SuperAdmin") {
  // }
  getAllGroups();
  getAllCourse();
  getAllRooms();
  getAllBranch();
});

const exit = () => {
  emit("close");
};

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      ModelService.lessonCreate(form_data.value).then((res) => {
        emit("create", res);
      });
    } else if (props.type == "update") {
      ModelService.lessonUpdate(props.id, form_data.value).then((res) => {
        emit("update", res);
      });
    }
  } catch (e) {}
};

const AddDays = ref([]);
const course_start_day = ref(new Date().getTime());
const weekDaysOptions = ref([
  {
    weekday: "Dushanba",
    course_date: "Monday",
    id: 1,
  },
  {
    weekday: "Seshanba",
    course_date: "Tuesday",
    id: 2,
  },
  {
    weekday: "Chorshanba",
    course_date: "Wednesday",
    id: 3,
  },
  {
    weekday: "Payshanba",
    course_date: "Thursday",
    id: 4,
  },
  {
    weekday: "Juma",
    course_date: "Friday",
    id: 5,
  },
  {
    weekday: "Shanba",
    course_date: "Saturday",
    id: 6,
  },
  {
    weekday: "Yakshanba",
    course_date: "Sunday",
    id: 7,
  },
]);
const lessonDaysName = ref([
  {
    weekday: "Monday",
    day_name: "Dushanba",
  },
  {
    weekday: "Tuesday",
    day_name: "Seshanba",
  },
  {
    weekday: "Wednesday",
    day_name: "Chorshanba",
  },
  {
    weekday: "Thursday",
    day_name: "Payshanba",
  },
  {
    weekday: "Friday",
    day_name: "Juma",
  },
  {
    weekday: "Saturday",
    day_name: "Shanba",
  },
  {
    weekday: "Sunday",
    day_name: "Yakshanba",
  },
]);
//// disabled date and check room
const timeFormat = ref({
  getHours1: null,
  getHours2: null,
  getMinutes1: null,
  getMinutes2: null,
});
const isHourDisabled = (hour) => {
  let hours1 = timeFormat.value.getHours1;
  let hours2 = timeFormat.value.getHours2;

  return hours1 <= hour && hours2 > hour;
};
const isMinuteDisabled = (minute) => {
  let minutes1 = timeFormat.value.getMinutes1;
  let minutes2 = timeFormat.value.getMinutes2;
  return minutes1 <= minute && minutes2 > minute && minute != 0;
};
///// disabled date and check room;

const resLength = ref(null);
const getTimeAction = (room, weekday, teacher) => {
  let sendData = {
    roomID: room,
    weekday: weekday,
    teacher_id: teacher,
  };
  ModelService.checkTable(sendData).then((res) => {
    if (res.length > 0) {
      res.forEach((row) => {
        let time1 = row.begin_date;
        let time2 = row.end_date;
        let [hours1, minutes1] = time1.split(":").map((str) => parseInt(str, 10));
        let [hours2, minutes2] = time2.split(":").map((str) => parseInt(str, 10));
        timeFormat.value.getHours1 = hours1;
        timeFormat.value.getHours2 = hours2;
        timeFormat.value.getMinutes1 = minutes1;
        timeFormat.value.getMinutes2 = minutes2;
        isHourDisabled(hours2);
        isMinuteDisabled(minutes2);
      });
    } else {
      resLength.value = 0;
    }
  });
};
const teacherID = ref(null);
const choosDays = (e) => {
  if (e != null) {
    const index = AddDays.value.findIndex((item) => item.course_date == e);
    if (index == -1) {
      weekDaysOptions.value.forEach((element) => {
        if (element.course_date == e) {
          let courseId = genarate_date.value.course_id;
          if (courseId != null) {

            CourseService.getOne(courseId).then((res) => {
              teacherID.value = res.teacher_id;
              getTimeAction(roomID.value, element.course_date, res.teacher_id);
            });

          }
          if (resLength.value == null) {

            let setHour1 = timeFormat.value.getHours2 + 0;
            let setMin1 = timeFormat.value.getMinutes2 + 0;

            let setHour2 = timeFormat.value.getHours2 + 2;
            let setMin2 = timeFormat.value.getMinutes2 + 0;
       
            AddDays.value.push({
              course_date: element.course_date,
              weekday: element.weekday,
              begin_date: `${setHour1}:${(1e2 + setMin1 + "").slice(-2)}`,
              end_date: `${setHour2}:${(1e2 + setMin2 + "").slice(-2)}`,
              room_id: roomID.value,
              idx: element.id,
            });
          } else {
            AddDays.value.push({
              course_date: element.course_date,
              weekday: element.weekday,
              begin_date: `8:00`,
              end_date: `10:00`,
              room_id: roomID.value,
              idx: element.id,
            });
          }
          AddDays.value.sort((a, b) => {
            return a.idx - b.idx;
          });
        }
      });
    }
    if (index != -1) {
      message.warning("Bu hafta kuni tanlangan");
    }
    if (weekDaysOptions.value.length == AddDays.value.length) {
      message.success("Hammas hafta kuni talandi");
    }
  }
};
const roomChange = ($event, index) => {
  let room = $event;
  let day = AddDays.value[index].course_date;
  let teacher = teacherID.value;
  getTimeAction(room, day, teacher);
};
const delBtn = (id) => {
  const index = AddDays.value.findIndex((item) => item.course_date == id);
  AddDays.value.splice(index, 1);
};

const spinTwo = ref(false);
const createLesson = ref(true);
const showDays = (type) => {
  spinTwo.value = true;
  if (type == "create") {
    setTimeout(() => {
      spinTwo.value = false;
      createLesson.value = false;
      daysWrapper.value = true;
    }, 500);
  } else if (type == "update") {
    setTimeout(() => {
      showLessonTable.value = true;
      spinTwo.value = false;
    }, 500);
  }
};
const showWrapper = () => {
  spinBtn.value = true;
  setTimeout(() => {
    spinBtn.value = false;
    createLesson.value = true;
    daysWrapper.value = false;
  }, 500);
};

const genarateSave = async () => {
  try {
    if (props.type == "update") {
      genarate_date.value.weekday = [];
      genarate_date.value.weekday = AddDays.value;
      genarate_date.value.start_date = dayJS(course_start_day.value).format(
        "YYYY-MM-DD"
      );
      spinBtn.value = true;
      ModelService.genrateDays(genarate_date.value)
        .then((res) => {
          LessonTable.value = res;
          showLessonTable.value = true;
          spinBtn.value = false;
        })
        .catch((err) => {
          message.error("Nimadur xato ");
          spinBtn.value = false;
          x
        });
    }
  } catch (e) {
    console.log(e);
  }
};
const UpdateGenrateBtn = async () => {
  showLessonTable.value = false;
  createLesson.value = false;
  counter.lesson = true;
  daysWrapper.value = true;
  // ModelService.updateGenrateDays().then(() => {
  //     console.log()
  // })
};
const spinLesson = ref(false);
const LessonTableWrapper = ref({
  parent_id: null,
  lesson_table: [],
});
const spinLessonAnimate = () => {
  setTimeout(() => {
    spinLesson.value = false;
    showLessonTable.value = false;
  }, 500);
};
const toggleLessonTable = () => {
  showLessonTable.value = true;
};
const SavLessonTable = async () => {
  if (counter.lesson == true) {
    LessonTableWrapper.value.parent_id = LessonID.value;
    LessonTableWrapper.value.lesson_table = LessonTable.value;
    spinLesson.value = true;
    ModelService.lessonTableCreate(LessonTableWrapper.value)
      .then((res) => {
        spinLessonAnimate();
        emit("close");
      })
      .catch((err) => {
        spinLesson.value = false;
      });
  } else {
    LessonTableWrapper.value.parent_id = LessonID.value;
    LessonTableWrapper.value.lesson_table = LessonTable.value;
    ModelService.lessonTableUpdate(LessonTableWrapper.value)
      .then((res) => {
        spinLessonAnimate();
        emit("close");
      })
      .catch((err) => {
        spinLesson.value = false;
      });
  }
};

/////////////////////////
////// genarate days functions
const dateDisabled = (val) => {
  return val < Date.now();
};
///////
//////////////// lesson tables functions add show actions
const onCreate = () => {
  return 1;
};
/////////////
/// group index start
const GroupName = ref("");
const showGroups = ref(false);
const showGroupsForm = ref(null);
const showGroupsFun = () => {
  showGroups.value = true;
  showGroupsForm.value = 0;
};
const chooseGroups = (data) => {
  getAllGroups();
  form_data.value.group_id = data;
  showGroups.value = false;
};
const GroupsKey = (e) => {
  if (e.code == "F4") {
    showGroupsFun();
  } else if (e.code == "Insert") {
    showGroups.value = true;
    showGroupsForm.value = 1;
  }
};
const SearchGroup = (group) => {
  GroupName.value = group;
};
//// group index end
//// rooms index start
const RoomName = ref("");
const showRoom = ref(false);
const showRoomForm = ref(null);
const showRoomFun = () => {
  showRoom.value = true;
  showRoomForm.value = 0;
};
const SearchRoom = (room) => {
  RoomName.value = room;
};
const RoomKey = (e) => {
  if (e.code == "F4") {
    showRoomFun();
  } else if (e.code == "Insert") {
    showRoom.value = true;
    showRoomForm.value = 1;
  }
};
const chooseRoom = (data) => {
  getAllRooms();
  form_data.value.room_id = data;
  showRoom.value = false;
};
//// rooms index end
//// select avatar

///
//// choose group and select course

//// render select function start
const renderRoomSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.name]
  );
};

const renderRoom = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.name]), h("div", null, [option.branch.name])]
      ),
    ]
  );
};

const renderGroupSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.name]
  );
};

const renderGroup = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.name]), h("div", null, [option.branch.name])]
      ),
    ]
  );
};
//// render select function end
const UpdateBranch = (branch) => {
  form_data.value.course_id = null;
  form_data.value.room_id = null;
  form_data.value.group_id = null;
  if (branch) {
    getAllGroups(branch);
    getAllCourse(branch);
    getAllRooms(branch);
  } else {
    coursesOptions.value = [];
    groupsOptions.value = [];
    roomsOptions.value = [];
  }
};
const UpdateGroup = (id) => {
  GroupService.getOne(id).then((res) => {
    form_data.value.course_id = res.course_id;
  });
};
// v-if="daysWrapper && counter.lesson"
////
// const pechat = ()
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <section v-if="createLesson">
        <n-spin size="large" :show="spinTwo">
          <n-grid
            cols="1 s:1 m:2 l:2"
            responsive="screen"
            :x-gap="12"
            :y-gap="4"
          >
            <n-grid-item v-if="findRole == 'SuperAdmin'">
              <n-form-item label="Filial" path="filial_id">
                <n-input-group>
                  <n-select
                    @update:value="UpdateBranch"
                    @keydown="GroupsKey"
                    @search="SearchGroup"
                    :options="branchOptions"
                    filterable
                    clearable
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.filial_id"
                  >
                    <template #action>
                      <p style="text-align: center">
                        Ro'yxatni ko'rish uchun "F4"
                      </p>
                    </template>
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "Insert"</p>
                    </template>
                  </n-select>
                  <n-button
                    @click="showGroupsFun"
                    type="success"
                    :style="{ padding: '0px 8px' }"
                  >
                    <Dots />
                  </n-button>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Guruh" path="group_id">
                <n-input-group>
                  <n-select
                    @update:value="UpdateGroup"
                    @keydown="GroupsKey"
                    @search="SearchGroup"
                    :options="groupsOptions"
                    :render-label="renderGroup"
                    :render-tag="renderGroupSelect"
                    filterable
                    clearable
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.group_id"
                  >
                    <template #action>
                      <p style="text-align: center">
                        Ro'yxatni ko'rish uchun "F4"
                      </p>
                    </template>
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "Insert"</p>
                    </template>
                  </n-select>
                  <n-button
                    @click="showGroupsFun"
                    type="success"
                    :style="{ padding: '0px 8px' }"
                  >
                    <Dots />
                  </n-button>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Kurs" path="course_id">
                <n-input-group>
                  <n-select
                    :disabled="true"
                    :options="coursesOptions"
                    filterable
                    clearable
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.course_id"
                  >
                  </n-select>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Xona" path="room_id">
                <n-input-group>
                  <n-select
                    @search="SearchRoom"
                    @keydown="RoomKey"
                    :options="roomsOptions"
                    :render-label="renderRoom"
                    :render-tag="renderRoomSelect"
                    filterable
                    clearable
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.room_id"
                  >
                    <template #action>
                      <p style="text-align: center">
                        Ro'yxatni ko'rish uchun "F4"
                      </p>
                    </template>
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "Insert"</p>
                    </template>
                  </n-select>
                  <n-button
                    @click="showRoomFun"
                    type="success"
                    :style="{ padding: '0px 8px' }"
                  >
                    <Dots />
                  </n-button>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <!-- <n-grid-item>
              <n-form-item label="Keyingi dars" path="next_lesson">
                <n-input
                  v-model:value="form_data.next_lesson"
                  :disabled="props.type == 'update' ? false : true"
                  clearable
                ></n-input>
              </n-form-item>
            </n-grid-item> -->
          </n-grid>
          <n-divider :style="{ margin: '12px 0px' }"></n-divider>
          <div class="btn-action">
            <n-button @click="exit" type="warning">
              <template #icon>
                <exit-icon />
              </template>
              Chiqish
            </n-button>
            <n-button @click="save" type="success">
              <template #icon>
                <n-icon>
                  <save-icon />
                </n-icon>
              </template>
              Saqlash
            </n-button>
            <n-button
              v-if="props.type == 'update'"
              @click="showDays(props.type)"
              type="success"
            >
              <template #icon>
                <n-icon>
                  <plan-icon />
                </n-icon>
              </template>
              {{ props.type == "update" ? "Dars jadvali" : "Hafta kunlari" }}
            </n-button>
          </div>
        </n-spin>
      </section>
    </n-form>
    <n-form :model="genarate_date" ref="formTwoRef" :rules="genarate_rules">
      <section v-if="daysWrapper && counter.lesson" class="course-wrapper">
        <n-spin size="large" :show="spinBtn">
          <n-grid
            cols="1 s:1 m:2 l:2"
            :x-gap="8"
            :y-gap="2"
            responsive="screen"
          >
            <n-grid-item>
              <n-form-item label="Boshlanish sanasi" path="start_date">
                <n-date-picker
                  :style="{ width: '100%' }"
                  :is-date-disabled="dateDisabled"
                  v-model:value="course_start_day"
                ></n-date-picker>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Kurs" path="course_id">
                <n-select
                  :disabled="true"
                  :options="coursesOptions"
                  filterable
                  clearable
                  label-field="name"
                  value-field="id"
                  v-model:value="genarate_date.course_id"
                ></n-select>
              </n-form-item>
            </n-grid-item>
          </n-grid>
          <n-form-item label="Hafta kuni">
            <n-select
              @update:value="choosDays"
              :options="weekDaysOptions"
              filterable
              label-field="weekday"
              value-field="course_date"
              placement="top-start"
            ></n-select>
          </n-form-item>
          <n-scrollbar style="max-height: 250px">
            <n-table style="min-width:620px" :single-line="false" size="small">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Hafta kuni</th>
                  <th>Boshlanish vaqti</th>
                  <th>Tugash vaqti</th>
                  <th>Xona</th>
                  <th style="max-width: 50px">Amallar</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in AddDays">
                  <td>{{ index + 1 }}</td>
                  <td>{{ item.weekday }}</td>
                  <td>
                    <n-time-picker
                      format="H:mm"
                      :is-hour-disabled="isHourDisabled"
                      :is-minute-disabled="isMinuteDisabled"
                      v-model:formatted-value="item.begin_date"
                    />
                  </td>
                  <td>
                    <n-time-picker
                      format="H:mm"
                      :is-hour-disabled="isHourDisabled"
                      :is-minute-disabled="isMinuteDisabled"
                      v-model:formatted-value="item.end_date"
                    />
                  </td>
                  <td>
                    <n-select
                      :options="roomsOptions"
                      :render-label="renderRoom"
                      :render-tag="renderRoomSelect"
                      label-field="name"
                      value-field="id"
                      v-model:value="item.room_id"
                      @update:value="roomChange($event, index)"
                      filterable
                      clearable
                    ></n-select>
                  </td>
                  <td style="max-width: 50px">
                    <div class="action-btns">
                      <n-button
                        @click="delBtn(item.course_date)"
                        type="warning"
                        size="small"
                      >
                        <template #icon>
                          <n-icon>
                            <del-icon />
                          </n-icon>
                        </template>
                      </n-button>
                    </div>
                  </td>
                </tr>
              </tbody>
            </n-table>
            <n-empty
              v-if="AddDays.length == 0"
              :style="{ margin: '12px 0px' }"
              description="Malumotlar yo'q"
            >
            </n-empty>
          </n-scrollbar>
          <n-divider></n-divider>
          <div class="btn-action">
            <n-button @click="exit" type="warning">
              <template #icon>
                <exit-icon />
              </template>
              Chiqish
            </n-button>
            <n-button @click="genarateSave" type="success">
              <template #icon>
                <n-icon>
                  <save-icon />
                </n-icon>
              </template>
              Saqlash
            </n-button>
            <n-button @click="showWrapper" type="success">
              <template #icon>
                <n-icon>
                  <plan-icon />
                </n-icon>
              </template>
              Dars
            </n-button>
            <n-button @click="toggleLessonTable" type="success">
              <template #icon>
                <n-icon>
                  <plan-icon />
                </n-icon>
              </template>
              Dars jadvali
            </n-button>
          </div>
        </n-spin>
      </section>
    </n-form>
  </div>
  <n-form :model="LessonTable" ref="LessonTableRef">
    <n-drawer
      :close-on-esc="false"
      :mask-closable="false"
      v-model:show="showLessonTable"
      width="100vw"
      height="calc(100vh - 120px)"
      placement="top"
    >
      <n-drawer-content title="Dars jadvali" closable>
        <n-spin :show="spinLesson">
          <n-scrollbar style="min-width: 1440px">
            <n-grid :cols="5">
              <n-grid-item>
                <div class="table-header-title">
                  <p>Dars nomi</p>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="table-header-title">
                  <p>Dars kuni</p>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="table-header-title">
                  <p>Hafta kuni</p>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="table-header-title">
                  <p>Dars vaqti</p>
                </div>
              </n-grid-item>
              <n-grid-item>
                <div class="table-header-title">
                  <p>Xona nomi</p>
                </div>
              </n-grid-item>
            </n-grid>
            <n-dynamic-input
              v-if="LessonTable.length != 0"
              v-model:value="LessonTable"
              :on-create="onCreate"
              show-sort-button
            >
              <template #create-button-default>
                Dars jadvali qo'shish
              </template>
              <template #default="{ value, index }">
                <n-grid :cols="5" :x-gap="5" :y-gap="4">
                  <n-grid-item>
                    <n-input-group>
                      <n-input-group-label>
                        №{{ index + 1 }}
                      </n-input-group-label>
                      <n-input
                        :style="{ width: '100%' }"
                        v-model:value="value.name"
                        clearable
                      />
                    </n-input-group>
                  </n-grid-item>
                  <n-grid-item>
                    <n-date-picker
                      :style="{ width: '100%' }"
                      v-model:formatted-value="value.date"
                      value-format="yyyy-MM-dd"
                      type="date"
                      clearable
                    ></n-date-picker>
                  </n-grid-item>
                  <n-grid-item>
                    <n-select
                      :options="lessonDaysName"
                      filterable
                      label-field="day_name"
                      value-field="weekday"
                      placement="top-start"
                      v-model:value="value.weekday"
                    ></n-select>
                  </n-grid-item>
                  <n-grid-item>
                    <n-input-group>
                      <n-time-picker
                        :style="{ width: '100%' }"
                        format="H:mm"
                        v-model:formatted-value="value.begin_date"
                      />
                      <n-input-group-label>
                        <n-icon :size="16">
                          <rightArrow />
                        </n-icon>
                      </n-input-group-label>
                      <n-time-picker
                        :style="{ width: '100%' }"
                        format="H:mm"
                        v-model:formatted-value="value.end_date"
                      />
                    </n-input-group>
                  </n-grid-item>
                  <n-grid-item>
                    <n-select
                      :options="roomsOptions"
                      :render-label="renderRoom"
                      :render-tag="renderRoomSelect"
                      label-field="name"
                      value-field="id"
                      v-model:value="value.room_id"
                      filterable
                      clearable
                    ></n-select>
                  </n-grid-item>
                  <n-grid-item span="5">
                    <n-divider :style="{ margin: '6px' }"></n-divider>
                  </n-grid-item>
                </n-grid>
              </template>
            </n-dynamic-input>
          </n-scrollbar>
          <div v-if="LessonTable.length == 0" class="d-grid-center">
            <n-empty size="large" description="Darslar mavjud emas"></n-empty>
          </div>
        </n-spin>
        <template #footer>
          <div class="btn-action">
            <div class="btn-action_item">
              <n-button @click="SavLessonTable('exit')" type="warning">
                <template #icon>
                  <exit-icon />
                </template>
                Chiqish
              </n-button>
            </div>
            <div class="btn-action_item">
              <n-button @click="SavLessonTable('save')" type="success">
                <template #icon>
                  <n-icon>
                    <save-icon />
                  </n-icon>
                </template>
                Saqlash
              </n-button>
            </div>
            <div class="btn-action_item">
              <n-button @click="UpdateGenrateBtn" type="success">
                <template #icon>
                  <n-icon>
                    <generic-icon />
                  </n-icon>
                </template>
                Qayta tahrirlash
              </n-button>
            </div>
          </div>
        </template>
      </n-drawer-content>
    </n-drawer>
  </n-form>

  <!-- Lesson start -->
  <n-modal
    transform-orign="center"
    v-model:show="showRoom"
    preset="card"
    style="max-width: calc(100% - 35px)"
  >
    <div class="no-padding">
      <RoomIndex
        @select="chooseRoom"
        :action="showRoomForm"
        :item-value="RoomName"
      ></RoomIndex>
    </div>
  </n-modal>
  <!-- Lesson end -->
  <!-- Group start -->
  <n-modal
    transform-orign="center"
    v-model:show="showGroups"
    preset="card"
    style="max-width: calc(100% - 35px)"
  >
    <div class="no-padding">
      <GroupIndex
        @select="chooseGroups"
        :action="showGroupsForm"
        :item-value="GroupName"
      ></GroupIndex>
    </div>
  </n-modal>
  <!-- Group end -->
</template>

<style scoped>
.table-header-title {
  background-color: #2080f0;
  padding: 8px 12px;
  margin-bottom: 4px;
}

.table-header-title p {
  color: #fff;
}

.d-grid-center {
  width: 100%;
  height: 100%;
  padding: 20px;
  margin: 12px 0px;
}

.action-btns {
  display: grid;
  place-items: center;
}

.d-flex-center {
  display: flex;
  justify-content: space-evenly;
  gap: 20px;
  flex-wrap: wrap;
}

.d-input-flex {
  display: grid;
  align-items: baseline;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  flex-wrap:wrap;
  gap: 8px;
}

.grid-item {
  display: grid;
  gap: 18px;
}

#dynamicInput {
  max-height: 520px;
  overflow: hidden;
  overflow-y: auto;
  padding-right: 12px;
}
</style>
