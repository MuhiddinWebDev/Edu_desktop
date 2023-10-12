<!-- Course Form -->
<script setup>
import { ref, onMounted, watch, inject, h } from "vue";
import { useMessage, NAvatar, NText, NTag, useNotification } from "naive-ui";
import Dots from "../../../components/Dots/dots.vue";
import ModelService from "../../../services/course.service";
import TeacherService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import TeacherIndex from "../Users/Index.vue";
import {
  Save24Filled as SaveIcon,
  Checkmark48Filled as CheckIcon,
  ErrorCircle24Filled as offlineIcon,
} from "@vicons/fluent";
import { Course as CourseIcon } from "@vicons/carbon";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import {
  LanguageTwotone as langIcon,
  AppRegistrationSharp as planIcon,
} from "@vicons/material";
import { useCounterStore } from "../../../stores/counter";

const counter = useCounterStore();
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref("");
const showFeedback = ref(false);
const fileList = ref([]);
const img_url = inject("course_img");
const user_image = inject("img_url");
const play_url = inject("course_video");

const findRole = ref( localStorage.getItem('role'));
const findBranch = ref( JSON.parse(localStorage.getItem('filial_id')));

const courseWrapper = ref(true);
const coursePlanWrapper = ref(false);
const spinBtn = ref(false);
const photo_url = ref("");
const video_url = ref("");
const message = useMessage();
const notification = useNotification();
const teacherList = ref([]);
const branchList = ref([]);
const TeacherName = ref("");

const form_data = ref({
  name: "",
  level: null,
  lang: "uz",
  price_month: 0,
  price_full: 0,
  online: false,
  teacher_id: null,
  image: "",
  filial_id: findRole.value != "SuperAdmin" ? findBranch.value: null,
});

const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        showFeedback.value = true;
        return new Error("Iltimos nomini kiritng");
      }
    },
  },
  level: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos darajani tanlang");
      }
    },
  },
  teacher_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos o'qtiuvchini tanlang");
      }
    },
  },
};
//// select options
const levelOption = [
  {
    name: "Boshlang'ich",
    level: "junior",
  },
  {
    name: "O'rtacha",
    level: "middle",
  },
  {
    name: "Murakkab",
    level: "senior",
  },
];
//////
const courseId = ref(null);
const inputInstRef = ref(null);
const getAllTeacherByIndex = (filial_id) => {
  if(filial_id){
    const sendData = {
      role:'Teacher',
      filial_id: findRole.value != "SuperAdmin" ? findBranch.value : filial_id,
      active:true,
      id:null,
    }
    TeacherService.getAll(sendData).then((res) => {
      teacherList.value = res;
    });
  }else{
    teacherList.value = []
  }
};
const getAllBranches = ()=>{
  BranchService.getAll().then((res) => {
    branchList.value = res;
  })
}
const updateBranch = (id)=>{
  form_data.value.teacher_id = null;
  getAllTeacherByIndex(id)
}
const limitValue = ref(0);

onMounted(() => {
  if (props.type == "update") {
    if (counter.coursePlan) {
      courseWrapper.value = false;
      coursePlanWrapper.value = true;
    } else {
      courseWrapper.value = true;
      coursePlanWrapper.value = false;
    }
    ModelService.getOne(props.id).then((res) => {
      courseId.value = res.id;
      form_data.value = res;
      photo_url.value = img_url + res.image;
      customValue.value = res.course_plan;
      limitValue.value = customValue.value.length;
      getAllTeacherByIndex(res.filial_id)
      res.course_plan.forEach((plan) => {
        video_url.value = play_url + plan.video;
      });
      showPrice.value = res.online;
    });
  }
  if (props.type == "create") {
    form_data.value.name = props.defaultname;
    inputInstRef.value?.focus();
  }
  if(findRole.value == "SuperAdmin"){
    getAllBranches();
  }
  if(findRole.value != "SuperAdmin"){
    getAllTeacherByIndex(findBranch.value)
  }
});

/// upload image funciton
watch(fileList, (val) => {
  if (val.length > 0) {
    form_data.value.image = val[0].file.name;
  }
});
//
/// swicht Action
const showPrice = ref(false);
const changeAction = (act) => {
  form_data.value.online = act;
  showPrice.value = act;
};
////////////////////////////////
// swicht start
const changeLang = (lang) => {
  if (lang) {
    form_data.value.lang = "uz";
  } else {
    form_data.value.lang = "ru";
  }
};
const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#253e35";
    if (focused) {
      style.boxShadow = "0 0 0 2px #253e35";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

watch(form_data.value, (item) => {
  if (item.online) {
    item.price_month = 0;
  } else {
    item.price_full = 0;
  }
});
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      const sendData = new FormData();
      if(fileList.value.length > 0){
        sendData.append("image", fileList.value[0].file);
      }else{
        sendData.append("image", "");
      }
      sendData.append("name", form_data.value.name);
      sendData.append("level", form_data.value.level);
      sendData.append("lang", form_data.value.lang);
      if (showPrice.value) {
        sendData.append("price_full", form_data.value.price_full);
        sendData.append("price_month", 0);
      } else {
        sendData.append("price_full", 0);
        sendData.append("price_month", form_data.value.price_month);
      }
      sendData.append("online", form_data.value.online);
      sendData.append("teacher_id", form_data.value.teacher_id);
      sendData.append("filial_id", form_data.value.filial_id);
      spinBtn.value = true;
      ModelService.createAdmin(sendData)
        .then((res) => {
          setTimeout(() => {
            spinBtn.value = false;
            emit("create", res);
          }, 500);
        })
        .catch((err) => {
          spinBtn.value = false;
          message.error("Ma'lumotlarda xatolik bor ");
        });
    } else if (props.type == "update") {
      const sendData = new FormData();
      if (fileList.value.length > 0) {
        sendData.append("image", fileList.value[0].file);
        sendData.append("change_image", true);
      } else {
        sendData.append("image", form_data.value.image);
        sendData.append("change_image", false);
      }
      sendData.append("name", form_data.value.name);
      sendData.append("level", form_data.value.level);
      sendData.append("lang", form_data.value.lang);
      if (showPrice.value) {
        sendData.append("price_full", form_data.value.price_full);
        sendData.append("price_month", 0);
      } else {
        sendData.append("price_full", 0);
        sendData.append("price_month", form_data.value.price_month);
      }
      sendData.append("online", form_data.value.online);
      sendData.append("teacher_id", form_data.value.teacher_id);
      sendData.append("filial_id", form_data.value.filial_id);
      spinBtn.value = true;
      
      ModelService.updateAdmin(props.id, sendData)
        .then((res) => {
          setTimeout(() => {
            spinBtn.value = false;
            emit("update", res);
          }, 500);
        })
        .catch((err) => {
          spinBtn.value = false;
          message.error("Ma'lumotlarda xatolik bor ");
        });
    }
  } catch (e) {}
};
//// plan course function and dynamic inputs;
const spinTwo = ref(false);
const planCourse = () => {
  spinBtn.value = true;
  setTimeout(() => {
    courseWrapper.value = false;
    coursePlanWrapper.value = true;
    spinBtn.value = false;
  }, 400);
};
const returnCourse = () => {
  spinTwo.value = true;
  setTimeout(() => {
    courseWrapper.value = true;
    coursePlanWrapper.value = false;
    spinTwo.value = false;
  }, 400);
};
const customValue = ref([]);
const dataCounter = ref(1);
///// scroll auto get position start
const scrollPostion = ref(null);
// const scrollBottom  = ()=>{
//     scrollPostion.value.scrollTop = scrollPostion.value.scrollHeight;
// }
// const scrollController = ()=>{
//     if(scrollPostion.value.scrollTop + scrollPostion.value.clientHeight == scrollPostion.value.scrollHeight ){
//         scrollBottom()
//     }
// }
///// scroll auto get position end
const onCreate = () => {
  // scrollController();
  return {
    id: new Date().getTime(),
    sequence_number: dataCounter.value++,
    name: `${dataCounter.value} dars`,
    video: "",
    video_duration: "",
  };
};
const keyDownCreate = (e) => {
  if (e.code == "Enter") {
    customValue.value.push({
      id: new Date().getTime(),
      sequence_number: dataCounter.value++,
      name: `${dataCounter.value + 1} dars`,
      video: "",
      video_duration: "",
    });
    // scrollController()
  }
};
//// close action notifications function //////////////////////////////////////////////////////////////////
const waringNote = () => {
  notification["warning"]({
    content: "Ogohlantirish",
    meta: "Dars qo'shish majburiy",
    duration: 3000,
    keepAliveOnHover: true,
  });
};
///// close action notifications function //////////////////////////////////////////////////////////////////
const videoId = ref(null);
const showId = (idx) => {
  videoId.value = idx;
};
const showAction = (file) => {
  const videoData = new FormData();
  if (file.length > 0) {
    videoData.append("video", file[0].file);
    if (counter.coursePlan) {
      ModelService.uploadVideoAdmin(videoData).then((res) => {
        const index = customValue.value.findIndex(
          (item) => item.id == videoId.value
        );
        customValue.value[index].video = res.video;
        customValue.value[index].video_duration = `${res.duration}`;
      });
    } else {
      ModelService.uploadVideoUpdateAdmin(videoData).then((res) => {
        const index = customValue.value.findIndex(
          (item) => item.id == videoId.value
        );
        customValue.value[index].video = res.video;
        customValue.value[index].video_duration = `${res.duration}`;
      });
    }
  }
};
const sendPlan = ref({
  course_id: null,
  course_plans: [],
});
const PlaneSave = async () => {
  try {
    sendPlan.value.course_id = courseId.value;
    sendPlan.value.course_plans = customValue.value;
    if (counter.coursePlan) {
      if (sendPlan.value.course_plans.length > 0) {
        ModelService.adminCreatePlan(sendPlan.value).then((res) => {
          emit("update", res);
        });
      } else {
        waringNote()
      }
    } else {
      if (sendPlan.value.course_plans.length > 0) {
        ModelService.adminUpdatePlan(sendPlan.value).then((res) => {
          emit("update", res);
        });
      } else {
        waringNote()
      }
    }
  } catch (e) {}
};

const autoPlane = ()=>{
  customValue.value=[];
  dataCounter.value=0;
  for(let i=0; i < limitValue.value; i++){
    customValue.value.push({
        id: new Date().getTime(),
        sequence_number: dataCounter.value++,
        name: `${dataCounter.value} dars`,
        video: "",
        video_duration: "",
      });
  }
}

const exit = (action) => {
  if (action == "course") {
    emit("close");
  } else if (action == "plane" &&customValue.value.length == 0) {
    waringNote()
  } else if( customValue.value.length > 0 ){
    emit('close')
  }
};
/////////////////////////
///// input format numbers
const format = (value) => {
  if (value === null) return "";
  return `${value.toLocaleString("ru-RU")}`;
};
const parse = (input) => {
  const nums = input.replace(/(,|\$|\s)/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
  return nums === "" ? null : Number.NaN;
};
/////////////////////////
//// teacher index start
const showTeacher = ref(false);
const showTeacherForm = ref(null);

const renderUserTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: user_image + option.image,
        round: true,
        size: 24,
        style: {
          marginRight: "12px",
        },
      }),
      option.fullname,
    ]
  );
};
const renderUser = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: user_image + option.image,
        round: true,
        size: "small",
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.fullname]), h(NText, { depth: 1, tag: "div" })],
        [h("div", null, [option.branch.name]), h(NText, { depth: 1, tag: "div" })]
      ),
    ]
  );
};
/////  teacher index end
//// add teacher by index vue
const teacherKey = (e) => {
  if (e.code == "F4") {
    showTeacher.value = true;
    showTeacherForm.value = 2;
  } else if (e.code == "Insert") {
    showTeacher.value = true;
    showTeacherForm.value = 3;
  }
};
const AddTeacherBtn = () => {
  showTeacher.value = true;
  showTeacherForm.value = 2;
};
const TeacherSearch = (teacher) => {
  TeacherName.value = teacher;
};
const chooseTeacher = (data) => {
  form_data.value.teacher_id = data.id;
  showTeacher.value = false;
  teacherList.value = [];
  getAllTeacherByIndex();
};
///
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <section v-if="courseWrapper" class="course-wrapper">
        <n-spin size="large" :show="spinBtn">
            <n-grid
              cols="1 s:2 m:2"
              :x-gap="12"
              :y-gap="2"
              responsive="screen"
            >
              <n-grid-item>
                <n-form-item
                  
                  label="Rasm yuklash"
                  path="image"
                >
                  <n-upload
                    accept="image/jpeg , image/png"
                    :max="1"
                    list-type="image"
                    v-model:file-list="fileList"
                  >
                  <n-button type="success" >Yuklash</n-button>
                </n-upload>
                </n-form-item>
                <n-image
                  v-if="props.type == 'update' && form_data.image.length > 0"
                  :src="photo_url"
                  :width="96"
                  :height="96"
                ></n-image>
              </n-grid-item>

              <n-grid-item v-if="findRole =='SuperAdmin'">
                <n-form-item
                  
                  label="Filial"
                  path="filial_id"
                >
                  <n-input-group>
                    <n-select
                      v-model:value="form_data.filial_id"
                      @update:value ="updateBranch"
                      :options="branchList"
                      label-field="name"
                      value-field="id"
                      filterable
                      clearable
                    >
                      <template #action>
                        <p style="text-align: center">
                          Ro'yxatni ko'rish "F4"
                        </p>
                      </template>
                      <template #empty>
                        <p style="text-align: center">
                          Qo'shish uchun "Insert"
                        </p>
                      </template>
                    </n-select>
                    <n-tooltip placement="right" trigger="hover">
                      <template #trigger>
                        <n-button
                          type="success"
                          :style="{ padding: '0px 8px' }"
                        >
                          <template #icon>
                            <Dots />
                          </template>
                        </n-button>
                      </template>
                      <span> Filial qo'shish </span>
                    </n-tooltip>
                  </n-input-group>
                </n-form-item>
              </n-grid-item>
              <n-grid-item>
                <n-form-item
                  
                  label="O'qituvchi"
                  path="teacher_id"
                >
                  <n-input-group>
                    <n-select
                      @keydown="teacherKey"
                      @search="TeacherSearch"
                      v-model:value="form_data.teacher_id"
                      :options="teacherList"
                      label-field="fullname"
                      value-field="id"
                      filterable
                      :render-label="renderUser"
                      :render-tag="renderUserTag"
                      clearable
                    >
                      <template #action>
                        <p style="text-align: center">
                          Ro'yxatni ko'rish "F4"
                        </p>
                      </template>
                      <template #empty>
                        <p style="text-align: center">
                          Qo'shish uchun "Insert"
                        </p>
                      </template>
                    </n-select>
                    <n-tooltip placement="right" trigger="hover">
                      <template #trigger>
                        <n-button
                          @click="AddTeacherBtn"
                          type="success"
                          :style="{ padding: '0px 8px' }"
                        >
                          <template #icon>
                            <Dots />
                          </template>
                        </n-button>
                      </template>
                      <span> O'qituvchi qo'shish </span>
                    </n-tooltip>
                  </n-input-group>
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <n-form-item
                  
                  label="Kurs darajasi"
                  path="level"
                >
                  <n-select
                    v-model:value="form_data.level"
                    :options="levelOption"
                    label-field="name"
                    value-field="level"
                    filterable
                    clearable
                  ></n-select>
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <n-form-item
                  
                  label="Kurs nomi"
                  path="name"
                >
                  <n-input
                    ref="inputInstRef"
                    v-model:value="form_data.name"
                    :maxlength="64"
                    show-count
                    clearable
                  ></n-input>
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <n-form-item
                  :style="{ width: '100%' }"
                  v-if="showPrice == false"
                  
                  label="Oylik narxi"
                  path="price_month"
                >
                  <n-input-number
                    :format="format"
                    :parse="parse"
                    :style="{ width: '100%' }"
                    :step="100000"
                    v-model:value="form_data.price_month"
                    clearable
                  ></n-input-number>
                </n-form-item>

                <n-form-item
                  :style="{ width: '100%' }"
                  v-if="showPrice == true"
                  
                  label="To'liq narxi"
                  path="price_full"
                >
                  <n-input-number
                    :style="{ width: '100%' }"
                    :step="100000"
                    v-model:value="form_data.price_full"
                    clearable
                  ></n-input-number>
                </n-form-item>
              </n-grid-item>

              <n-grid-item>
                <div class="d-flex-row">
                  <n-form-item
                    
                    label="Kurs turi"
                    path="online"
                    v-show="false"
                  >
                    <n-switch
                      @update:value="changeAction"
                      v-model:value="form_data.online"
                      :rail-style="railStyle"
                    >
                      <template #checked-icon>
                        <n-icon>
                          <check-icon />
                        </n-icon>
                      </template>
                      <template #unchecked-icon>
                        <n-icon>
                          <offline-icon />
                        </n-icon>
                      </template>
                      <template #checked> Online </template>
                      <template #unchecked> Offline </template>
                    </n-switch>
                  </n-form-item>
                  <n-form-item
                    
                    label="Kurs tili"
                    path="lang"
                  >
                    <n-switch
                      @update:value="changeLang"
                      :value="form_data.lang == 'uz' ? true : false"
                      :rail-style="railStyle"
                    >
                      <template #icon>
                        <n-icon>
                          <lang-icon />
                        </n-icon>
                      </template>
                      <template #checked> Uzbek </template>
                      <template #unchecked> Russia </template>
                    </n-switch>
                  </n-form-item>
                </div>   
              </n-grid-item>
            </n-grid>
          <n-divider></n-divider>
          <div class="btn-action">
            <n-button @click="exit('course')" type="warning">
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
              @click="planCourse"
              type="success"
            >
              <template #icon>
                <n-icon>
                  <plan-icon />
                </n-icon>
              </template>
              Kurs reja
            </n-button>
          </div>
        </n-spin>
      </section>
      <section v-if="coursePlanWrapper" class="course-plan-wrapper">
        <n-spin :show="spinTwo">
          <div class="d-row">
            <div class="d-row_item">
              <h2>Kurs nomi: {{ form_data.name }}</h2>
            </div>
            <div class="d-row_item">
              <div class="d-row_item_child">
                <n-input-group>
                  <n-input-group-label>Dars soni</n-input-group-label>
                  <n-input-number v-model:value="limitValue"  :default-value="1" :min="1"></n-input-number>
                </n-input-group>
                <n-button type="success" @click="autoPlane"> Qo'shish</n-button>
              </div>
            </div>
          </div>
          <n-scrollbar ref="scrollPostion" style="max-height: 520px">
            <n-dynamic-input
              class="prive-input"
              :min="1"
              v-model:value="customValue"
              :on-create="onCreate"
              show-sort-button
            >
              <template #create-button-default> Dars qo'shish </template>
              <template #default="{ value, index }">
                <n-card>
                  <template #header> № {{ index + 1 }} dars </template>
                  <div class="d-input-flex">
                    <n-input-group>
                      <n-input-group-label>Nomi</n-input-group-label>
                      <n-input
                        @keydown="keyDownCreate"
                        :style="{ width: '100%' }"
                        v-model:value="value.name"
                      />
                    </n-input-group>
                    <n-divider :style="{ margin: '12px 0px' }"></n-divider>
                    <n-upload
                      v-if="form_data.online"
                      @click="showId(value.id)"
                      accept="video/mp4 , video/mov, video/m4a0, video/3gp "
                      size="small"
                      style="display: flex; align-items: center"
                      :max="1"
                      @update:file-list="showAction"
                    >
                      <n-button :style="{ width: '100%' }" type="success"
                        >Video yuklash</n-button
                      >
                    </n-upload>
                    <!-- <video ref="video" />
                                                        <button @click="playing = !playing">Play / Pause</button>
                                                        <span>{{ currentTime }} / {{ duration }}</span>
                                                        {{ video_url }} -->
                  </div>
                </n-card>
              </template>
            </n-dynamic-input>
          </n-scrollbar>
          <n-divider></n-divider>
          <div class="btn-action">
            <n-button @click="exit('plane')" type="warning">
              <template #icon>
                <exit-icon />
              </template>
              Chiqish
            </n-button>
            <n-button @click="PlaneSave" type="success">
              <template #icon>
                <n-icon>
                  <save-icon />
                </n-icon>
              </template>
              Saqlash
            </n-button>
            <n-button @click="returnCourse" type="success">
              <template #icon>
                <n-icon>
                  <course-icon />
                </n-icon>
              </template>
              Kursga qaytish
            </n-button>
          </div>
        </n-spin>
      </section>
    </n-form>
  </div>
  <!-- Teacher index start -->
  <n-modal
    transform-orign="center"
    v-model:show="showTeacher"
    preset="card"
    style="max-width: calc(100% - 35px)"
  >
    <div class="no-padding">
      <teacher-index
        @select="chooseTeacher"
        :action="showTeacherForm"
        :itemValue="TeacherName"
      ></teacher-index>
    </div>
  </n-modal>
  <!-- Teacher index end -->
</template>

<style scoped>
.d-row_item_child{
  display: flex;
  align-items: center;
  gap: 12px;
}
.d-flex-row{
  display: flex;
  align-items: center;
  gap:12px;
}
.d-row{
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 8px;
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
  gap: 12px;
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
