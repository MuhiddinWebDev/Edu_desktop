<script setup>
import { h, ref, onMounted, watch, reactive } from "vue";

import ModelService from "../../../services/lesson.service";
import GroupsService from "../../../services/groups.service";
import CourseService from "../../../services/course.service";
import BranchService from "../../../services/branch.service";

import { NButton, NIcon, useMessage, useDialog, NImage } from "naive-ui";
import { useMagicKeys } from "@vueuse/core";
import ModelForm from "./Form.vue";
import { Add20Filled as AddIcon } from "@vicons/fluent";
import { TrashCan as TrashIcon, Pen as PenICon, Group } from "@vicons/carbon";
import { useCounterStore } from "../../../stores/counter";
const counter = useCounterStore();
const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const Getdata = ref([]);
const loading = ref(true);

const courseId = ref(null);
const groupId = ref(null);
const branchId = ref(null);

const groupOptions = ref([]);
const courseOptions = ref([]);
const branchOptions = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const send_data = ref({
  group_id: groupId.value,
  course_id: courseId.value,
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
});
const getAllData = (group, course, branch) => {
  const inData = {
    group_id: group,
    course_id: course,
    filial_id: findRole.value == "SuperAdmin" ? branch : findBranch.value,
  };
  ModelService.getAll(inData).then((res) => {
    Getdata.value = res;
    loading.value = false;
  });
};
const getAllGroups = (branch) => {
  if (branch) {
    send_data.value.filial_id = branch;
  }
  GroupsService.searchModel(send_data.value).then((res) => {
    groupOptions.value = res;
  });
};
const getAllCourse = (branch) => {
  if (branch) {
    send_data.value.filial_id = branch;
  }
  CourseService.searchModel(send_data.value).then((res) => {
    courseOptions.value = res;
  });
};
const getAllBranch = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};

const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return Getdata.value.findIndex((item) => item.id == row.id) + 1;
    },
  },
  {
    title: "Guruh",
    key: "group.name",
    resizable: true,
  },
  {
    title: "Kurs",
    key: "course.name",
    resizable: true,
  },
  {
    title: "O'qituvchi",
    key: "course.teachers.fullname",
    resizable: true,
  },
  {
    title: "Xona",
    key: "room.name",
    resizable: true,
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
  },
  // {
  //   title: "Keyingi dars",
  //   key: "next_lesson",
  //   resizable: true,
  // },
  {
    title: "Amallar",
    key: "action",
    width: 75,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "success",
            block: true,
            onClick: (e) => {
              showUpdate.value = true;
              updateId.value = row.id;
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
        //         content: `${row.group.name} Rostan ham o'chirasizmi`,
        //         positiveText: "Xa",
        //         negativeText: "Yo'q",
        //         onPositiveClick: () => {
        //           ModelService.delete(row.id)
        //             .then((res) => {
        //               const index = Getdata.value.findIndex(
        //                 (val) => val.id == row.id
        //               );
        //               Getdata.value.splice(index, 1);
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

onMounted(() => {
  if (findRole.value == "SuperAdmin") {
    getAllBranch();
    getAllGroups(null);
    getAllCourse(null);
  } else {
    getAllGroups(findBranch.value);
    getAllCourse(findBranch.value);
  }
  getAllData();
});
///  create and update functions
const closeCreate = () => {
  showCreate.value = false;
  counter.lesson = false;
};

const createModel = (res) => {
  showCreate.value = false;
  updateId.value = res.id;
  showUpdate.value = true;
  counter.lesson = true;
  getAllData();
  message.success("Ma'lumot qo'shildi");
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
    counter.lesson = false;
  } else if (e == "update") {
    showUpdate.value = false;
    counter.lesson = false;
  }
};
const closeUpdate = () => {
  showUpdate.value = false;
  counter.lesson = false;
};
const updateModel = () => {
  showUpdate.value = false;
  counter.lesson = false;
  getAllData();
  message.success("Ma'lumot yangilandi");
};
///// window key event start
const { insert /* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v) showCreate.value = true;
});
//// window key event end
//// search function strat
const UpdateBranch = (branch) => {
  getAllGroups(branch);
  getAllCourse(branch);
  courseId.value = null;
  groupId.value = null;
};

const UpdateCourse = (id) => {
  courseId.value = id;
  groupId.value = null;
};

const UpdateGroup = (id) => {
  groupId.value = id;
};

const searchBtn = () => {
  getAllData(
    groupId.value,
    courseId.value,
    findRole.value == "SuperAdmin" ? branchId.value : findBranch.value
  );
};

/// search function end

//// render select function start
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
        [h("div", null, [option.name]), h("div", null, [option.branch.name])]
      ),
    ]
  );
};
//// render select function end

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
          <h2>Darslar</h2>
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
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              v-model:value="groupId"
              :options="groupOptions"
              @update:value="UpdateGroup"
              :render-label="renderGroup"
              :render-tag="renderGroupSelect"
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
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="Getdata"
        :bordered="true"
        :single-line="false"
        style="min-width: 950px"
        size="small"
        max-height="calc(100vh - 300px)"
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
        style="max-width: 900px; width: calc(100vw - 15px); max-height: 900px"
        title="Dars qo'shish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm @close="closeCreate" @create="createModel" type="create" />
      </n-card>
    </n-modal>
    <n-modal
      transform-orign="center"
      v-model:show="showUpdate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 900px; width: calc(100vw - 15px); max-height: 900px"
        title="Darsni o'zgartirish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('update')"
      >
        <ModelForm
          @close="closeUpdate"
          type="update"
          :id="updateId"
          @update="updateModel"
        />
      </n-card>
    </n-modal>
  </section>
  <!-- create more  -->
</template>
