<script setup >
import { h, ref, onMounted, watch, reactive, inject } from "vue";
import { useMagicKeys } from "@vueuse/core";

import ModelService from "../../../services/attendance.service";
import CourseService from "../../../services/course.service";
import BranchService from "../../../services/branch.service";
import GroupsService from "../../../services/groups.service";

import { NButton, NIcon, useMessage, useDialog } from "naive-ui";
import ModelForm from "./Form.vue";

import {
  Add20Filled as AddIcon,
} from "@vicons/fluent";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";
import { useReportData } from "../../../stores/report";

const reportAct = useReportData();

const props = defineProps(["type", "action", "itemValue"]);
const emits = defineEmits(["select"]);
const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const loading = ref(true);
const defaultName = ref("");
const dayJS = inject('dayJS')
//// select options get all
const groupsOptions = ref([]);
const courseOptions = ref([]);
const branchOptions = ref([]);
///// select options get all
//// search id variables
const groupsId = ref(null);
const courseId = ref(null);
const branchId = ref(null);
const findRole = ref( localStorage.getItem('role'));
const findBranch = ref( JSON.parse(localStorage.getItem('filial_id')));

const send_data = ref({
  filial_id: findRole.value == 'SuperAdmin' ? null: findBranch.value,
  course_id: courseId.value,
  group_id: groupsId.value
})
//// search name variables
const getALlCourse = (branch_id) => {
  if(branch_id){
    send_data.value.filial_id = branch_id;
  }
  CourseService.searchModel(send_data.value).then((res) => {
    courseOptions.value = res;
  });
};

const getAllBranches = ()=>{
  BranchService.getAll().then((res)=>{
    branchOptions.value = res;
  })
}

const getAllGroups = (branch_id, course_id)=>{
  if(branch_id){
    send_data.value.filial_id = branch_id;
  }
  if(course_id){
    send_data.value.course_id = course_id;
  }
  GroupsService.searchModel(send_data.value).then((res)=>{
    groupsOptions.value = res;
  });
}

const getBySearch = (group, course, branch) => {
  loading.value = true;
  const in_send_data = {
    group_id: group,
    course_id: course,
    filial_id: branch
  }
  ModelService.searchModel(in_send_data).then((res) => {
    data.value = res;
    loading.value = false;
  });

};

const data = ref([]);
const columns = ref([
  {
    title: "№",
    key: "id",
    width: 50,
    align: "center"
  },
  {
    title: "Sana",
    key: "date",
    resizable: true,
    sortOrder:true,
    sorter:"default",
    width:250,
    render(row) {
        return dayJS(row.date * 1000).format('YYYY-MM-DD HH:mm:ss');
    }
  },
  {
    title: "Guruh",
    key: "group.name",
    resizable: true,
    sortOrder:true,
    sorter:"default",
  },
  {
    title: "Kurs",
    key: "course.name",
    resizable: true,
    sortOrder:true,
    sorter: (rowC1, rowC2) => rowC1.course.id - rowC2.course.id,
    render(row) {
      if (row.course == null) {
        return "Kurs o'chirilgan";
      } else {
        return row.course.name;
      }
    },
  },
  {
    title: "O'qituvchi",
    key: "teacher.fullname",
    resizable: true,
    sortOrder:true,
    sorter:"default",
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder:true,
    sorter: (rowC1, rowC2) => rowC1.branch.id - rowC2.branch.id,
  },
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
        //         content: `Rostan ham o'chirasizmi`,
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

onMounted(() => {
  
  if (props.action) {
    showCreate.value = true;
    defaultName.value = props.itemValue;
  }
  if(findRole.value == "SuperAdmin"){
    getAllBranches(null);
    getALlCourse(null);
    getAllGroups(null,null);
    getBySearch(null, null, null);
  }
  if(findRole.value != "SuperAdmin"){
    branchId.value = findBranch.value
    getALlCourse(findBranch.value);
    getAllGroups(findBranch.value,null);
    getBySearch(null, null, branchId.value);
  }

});
///  create and update functions
const closeCreate = () => {
  showCreate.value = false;
};
const createModel = () => {
  showCreate.value = false;
  message.success("Ma'lumot qo'shildi");
  getBySearch(null, null, branchId.value);
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }else if(e == 'read'){
    reportAct.attandancePass.read = false;
  }
};
const closeUpdate = () => {
  showUpdate.value = false;
};
const updateModel = () => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  getBySearch(null, null, branchId.value);
};

////////////////////////////////
//// search button click show info;
const UpdateBranch = (branch)=>{
  courseId.value = null;
  getALlCourse(branch);
  getAllGroups(branch, null);
}


const UpdateCourse = (course_id) => {
  groupsId.value = null;
  getAllGroups(branchId.value, course_id);
};

const UpdateGroup = (id ) => {
  if (id != null) {
    
  }
};

const searchFuction = () => {
  getBySearch(groupsId.value, courseId.value, branchId.value);
};
// button end

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
      }
});
///// pagination end
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
        [
          h("div", null, [option.name]),
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
          <h2>Davomat olish</h2>
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
          <n-input-group>
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              v-model:value="groupsId"
              :options="groupsOptions"
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
          <n-button @click="searchFuction" type="success">Ko'rish</n-button>
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
        style="min-width: 1000px; max-height: calc(100vh - 300px)"
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
        style="max-width: 1000px; width: calc(100vw - 20px)"
        title="Davomat qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm
          @close="closeCreate"
          @create="createModel"
          :defaultname="defaultName"
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
        style="max-width: 1000px; width: calc(100vw - 20px)"
        title="Davomatni o'zgartirish"
        :bordered="false"
        size="medium"
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

    <n-modal
      transform-orign="center"
      v-model:show="reportAct.attandancePass.read"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 1000px; width: calc(100vw - 20px)"
        :title="'№' + reportAct.attandancePass.id + ' Davomat'"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('read')"
      >
        <ModelForm
          type="read"
          :id="reportAct.attandancePass.id"
        />
      </n-card>
    </n-modal>
  </section>
  <!-- create more  -->
</template>
