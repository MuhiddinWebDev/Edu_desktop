<script setup>
import { h, ref, onMounted, inject, watch, reactive } from "vue";
import { useMagicKeys } from "@vueuse/core";

import ModelService from "../../../services/course.service";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";

import { NButton, NIcon, useMessage, useDialog, NImage } from "naive-ui";
import ModelForm from "./Form.vue";
import ModelRead from "./Read.vue"
import { Add20Filled as AddIcon } from "@vicons/fluent";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";
import { RemoveRedEyeRound as EyeIcon} from "@vicons/material";
import { useCounterStore } from "../../../stores/counter";

const loading = ref(true);
const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue"]);
const counter = useCounterStore();
const message = useMessage();
const dialog = useDialog();

const showCreate = ref(false);
const showUpdate = ref(false);
const showRead = ref(false);

const readId = ref(null);
const updateId = ref(null);

const img_url = inject("course_img");
const data = ref([]);
const defaultname = ref("");
//// select options  variables
const courseOptions = ref([]);
const teacherOptions = ref([]);
const branchOptions = ref([]);
////////////////////////////////
//// select value ID variables
const courseId = ref(null);
const teacherId = ref(null);
const branchId = ref(null);
////////////////////////////////
//// find action 
const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

//// find the action
const sendData = ref({
  course_id: null,
  role: null,
  teacher_id: null,
  filial_id: findRole.value == "SuperAdmin" ? null: findBranch.value,
})
const getTeacher = (branch_id) => {
  sendData.value.role ='Teacher';
  if(branch_id){
    sendData.value.filial_id = branch_id;
  }
  UserService.getAll(sendData.value).then((res) => {
    teacherOptions.value = res;
  });
};

const getAllCourse = (branch_id)=>{
  if(branch_id){
    sendData.value.filial_id = branch_id;
  }
  ModelService.searchModel(sendData.value).then((res) => {
    courseOptions.value = res;
  });
}

const getBySearch = (course, teacher, branch) => {
  loading.value = true;
  const sendData = {
    course_id: course,
    teacher_id: teacher,
    filial_id: branch,
  };
  ModelService.searchModel(sendData).then((res) => {
    data.value = res;
    loading.value = false;
  });
};
const getBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
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
    sorter: "default"
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
    sorter: "default"
  },
  
  {
    title: "Oylik narxi",
    key: "price_month",
    resizable: true,
    titleAlign:'center',
    align:'right',
    sortOrder: true,
    sorter: "default",
    render(row) {
      return new Intl.NumberFormat("ru-Ru", {
        style: "decimal",
      }).format(row.price_month);
    },
  },
  {
    title: "Darslar soni",
    key: "lesson_count",
    resizable: true,
    titleAlign:'center',
    align:'right',
    render(row) {
      return new Intl.NumberFormat("ru-Ru", {
        style: "decimal",
      }).format(row.course_plan.length);
    },
  },
  
  // {
  //   title: "To'liq narxi",
  //   key: "price_full",
  //   resizable: true,
  //   align:'right',

  //   render(row) {
  //     return new Intl.NumberFormat("ru-Ru", {
  //       style: "decimal",
  //     }).format(row.price_full);
  //   },
  // },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder: true,
    sorter: (row1, row2) => row1.branch.id - row2.branch.id
  },
  {
    title: "Tili",
    key: "lang",
    resizable: true,
    sortOrder: true,
    sorter: "default",
    width:60,
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
      if(row.image != ""){
        return h(NImage, {
          height: 50,
          objectFit: "contain",
          src: img_url + row.image,
        });
      }else{
        return "Rasm yo'q"
      }
    },
  },
  {
    title: "Amallar",
    key: "action",
    width: 105,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "info",
            onClick: (e) => {
              showRead.value = true;
              readId.value = row.id;
            },
            style:{
              marginRight:'12px'
            }
          },
          {
            icon: () =>
              h(NIcon, {
                component: EyeIcon,
              }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            onClick: (e) => {
              showUpdate.value = true;
              updateId.value = row.id;
              counter.coursePlan = false;
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: PenICon,
              }),
          }
        ),
        // h(
        //   NButton,
        //   {
        //     size: "small",
        //     type: "error",
        //     style: {
        //       marginLeft: "8px",
        //     },
        //     onClick: (e) => {
        //       dialog.warning({
        //         title: "Ogohlantirish",
        //         content: `${row.id} Rostan ham o'chirasizmi`,
        //         positiveText: "Xa",
        //         negativeText: "Yo'q",
        //         onPositiveClick: () => {
        //           ModelService.delete(row.id)
        //             .then((res) => {
        //               const index = data.value.findIndex(
        //                 (val) => val.id == row.id
        //               );
        //               data.value.splice(index, 1);
        //               message.success("Ma'lumot o'chirildi");
        //             })
        //             .catch((err) => {
        //               message.error("Ma'lumot o'chirilmadi");
        //             });
        //         },
        //         onNegativeClick: () => {
        //           message.error("Ma'lumot o'chirilmadi");
        //         },
        //       });
        //     },
        //   },
        //   {
        //     icon: () =>
        //       h(NIcon, {
        //         component: TrashIcon,
        //       }),
        //   }
        // ),
      ];
    },
  },
]);

const UpdateBranch = (branch_id)=>{
  teacherId.value = null,
  courseId.value = null,
  getAllCourse(branch_id);
  getTeacher(branch_id);
}

onMounted(() => {
  if (props.action == 1) {
    showCreate.value = true;
    defaultname.value = props.itemValue;
  } else if (props.action == 0) {
    showCreate.value = false;
  }
  if(findRole.value =='SuperAdmin'){
    getBranches();
    getBySearch(null,null,null);
    getAllCourse(null)
    getTeacher(null);
  }else{
    getBySearch(null,null, findBranch.value);
    getAllCourse(findBranch.value)
    getTeacher(findBranch.value);
  }
});
///  create and update functions


const createModel = (res, action) => {
  showCreate.value = false;
  updateId.value = res.id;
  counter.coursePlan = true;
  showUpdate.value = true;
  if(findRole.value =='SuperAdmin'){
    getBySearch(null,null,null)
  }else{
    getBySearch(null,null,findBranch.value)
  }
};

const closeModel = (action) => {
  if(action == 'update'){
    showUpdate.value = false;
  }else if(action == 'read'){
    showRead.value = false
  }else if(action == 'create'){
    showCreate.value = false;
  }
};

const updateModel = () => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  if(findRole.value =='SuperAdmin'){
    getBySearch(null,null,null)
  }else{
    getBySearch(null,null,findBranch.value)
  }
};

const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      emits("select", row);
    },
  };
};
///// select search function
const UpdateCourse = (id) => {
 
};
const UpdateTeacher = (id) => {
  courseId.value = null;
};

const searchBtn = () => {
  getBySearch(courseId.value, teacherId.value, branchId.value);
};
///// end function

///// window key event start
const { insert /* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v) showCreate.value = true;
});
//// window key event end

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

//// render select function start
const renderTeacherSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.fullname]
  );
};

const renderTeacher = (option) => {
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
        [
          h("div", null, [option.fullname]),
          h("div", null, [option.branch.name]),
        ]
      ),
    ]
  );
};

const renderCourseSelect = ({ option }) => {
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

const renderCourse = (option) => {
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
        [
          h("div", null, [option.name]),
          h("div", null, [option.branch.name]),
        ]
      ),
    ]
  );
};
//// render select function end
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Kurslar</h2>
        </div>
        <div class="box-header_item">
          <n-button @click="showCreate = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish <span class="Insert-key">Insert</span>
          </n-button>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              v-model:value="branchId"
              :options="branchOptions"
              @update:value="UpdateBranch"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            >
            </n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>O'qituvchi</n-input-group-label>
            <n-select
              v-model:value="teacherId"
              :options="teacherOptions"
              @update:value="UpdateTeacher"
              :render-label="renderTeacher"
              :render-tag="renderTeacherSelect"
              label-field="fullname"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Kurs</n-input-group-label>
            <n-select
              v-model:value="courseId"
              :options="courseOptions"
              @update:value="UpdateCourse"
              :render-label="renderCourse"
              :render-tag="renderCourseSelect"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
      
        <div class="search-action_item">
          <n-button @click="searchBtn" type="success">Ko'rish</n-button>
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
        :row-props="rowProps"
      >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <n-modal
      transform-orign="center"
      v-model:show="showCreate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 800px; width: calc(100vw - 15px)"
        title="Kurs qo'shish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="closeModel('create')"
      >
        <ModelForm
          @close="closeModel('create')"
          @create="createModel"
          :defaultname="defaultname"
          type="create"
        />
      </n-card>
    </n-modal>
    <n-modal
      transform-orign="center"
      v-model:show="showUpdate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 800px; width: calc(100vw - 15px)"
        title="Kursni o'zgartirish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="closeModel('update')"
      >
        <ModelForm
          @close="closeModel('update')"
          type="update"
          :id="updateId"
          @update="updateModel"
        />
      </n-card>
    </n-modal>
    <n-modal
      transform-orign="center"
      v-model:show="showRead"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 800px; width: calc(100vw - 15px)"
        title="Kurs ma'lumoti"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="closeModel('read')"
      >
        <ModelRead
          @close="closeModel('read')"
          type="read"
          :id="readId"
        />
      </n-card>
    </n-modal>
  </section>
  <!-- create more  -->
</template>
