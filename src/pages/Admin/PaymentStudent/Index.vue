<script setup>
import { h, ref, onMounted, reactive, inject } from "vue";
import ModelService from "../../../services/studentPay.service";
import { NButton, NIcon, useMessage, useDialog } from "naive-ui";
import CourserService from "../../../services/course.service";
import GroupService from "../../../services/groups.service";
import BranchService from "../../../services/branch.service";
import ModelForm from "./Form.vue";
import ModelCheck from "./Check.vue";
import { 
  Add20Filled as AddIcon,
  Print20Regular as PrintIcon 
} from "@vicons/fluent";
import { RemoveRedEyeSharp as eyeIcon } from "@vicons/material";
import { Pen as PenIcon } from "@vicons/carbon";
import { useReportData } from "../../../stores/report";

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const reportAct = useReportData();
const message = useMessage();
const dayJS = inject("dayJS");

const showCreate = ref(false);
const showUpdate = ref(false);
const showCheck = ref(false);

const updateId = ref(null);
const checkId = ref(null);

const Data = ref([]);
const loading = ref(true);
const courserOptions = ref([]);
const branchesOptions = ref([]);
const groupsOptions = ref([]);
const studentsOptions = ref([]);
const studentName = ref(null);

const sendData = ref({
  filial_id: findRole.value == 'SuperAdmin' ? null : findBranch.value,
  course_id: null,
  group_id: null,
  student_id: null,
})

const getAllDef = () => {
  loading.value = true;
  ModelService.searchModel(sendData.value).then((res) => {
    Data.value = res;
    loading.value = false;
  });
};

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchesOptions.value = res;
  })
}

const getAllCourses = (id) => {
  let searchData = {
    filial_id: findRole.value == 'SuperAdmin'? id : findBranch.value,
  }
  CourserService.searchModel(searchData).then((res) => {
    courserOptions.value = res;
  })
}

const getAllGroups = (id) => {
  let searchData = {
    filial_id: findRole.value == 'SuperAdmin'? sendData.value.filial_id : findBranch.value,
    course_id: id,
  }
  GroupService.searchModel(searchData).then((res) => {
    groupsOptions.value = res;
  })
}

const getAllStudents = (id) => {
  let searchData = {
    filial_id: findRole.value == 'SuperAdmin'? sendData.value.filial_id : findBranch.value,
    group_id: id,
  }
  GroupService.getCourseStudent(searchData).then((res) => {
    studentsOptions.value = res.students;
  });
}

const updateBtn = (id) => {
  showUpdate.value = true;
  updateId.value = id;
  console.log(showUpdate.value)

};
const checkBtn = (id)=>{
  showCheck.value = true;
  checkId.value = id;
}
const columns = ref([
  {
    title: "№",
    key: "id",
    width: 50,
    align: "center",
  },
  
  {
    title: "To'lov sanasi",
    key: "datetime",
    resizable: true,
    render(row) {
      return dayJS(row.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title:'Talaba',
    key:'user.fullname',
  },
  {
    title:'Guruh',
    key:'group.name',
  },
  {
    title:'Kurs',
    key:'course.name',
  },
  {
    title:'Kurs narxi',
    key:'course.price_month',
    align:'right',
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.course.price_month);
    },
  },
  {
    title: "Chegirma summa",
    key: "discount_sum",
    resizable: true,
    align:'right',
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.discount_sum);
    },
  },
  {
    title: "To'langan summa",
    key: "pay_sum",
    resizable: true,
    align:'right',
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.pay_sum);
    },
  },
  {
    title:"To'lov turi",
    key:"pay_type.name"
  },
  {
    title:"Filial",
    key:"branch.name"
  },
  {
    title:"Izoh",
    key:"comment"
  },
  {
    title: "Amal",
    key: "action",
    width: 100,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            style:{
              background:'#044e82',
              color:'#fff'
            },
            onClick: (e) => {
              checkBtn(row.id);
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: PrintIcon,
              }),
          }
        ),
        h(
          NButton,
          {
            size: "small",
            type: "success",
            style:{
              marginLeft:'8px'
            },
            onClick: (e) => {
              updateBtn(row.id);
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: PenIcon,
              }),
          }
        ),
      ];
    },
  },
]);

onMounted(() => {
  getAllDef();
  getAllBranches();
  getAllCourses();
});
//// row click open update

////
///  create and update functions
const closeCreate = () => {
  showCreate.value = false;
};
const createModel = (res) => {
  showCreate.value = false;
  getAllDef();
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }else if( e == 'read'){
    reportAct.studentPass.read = false;
  }else if(e == 'check'){
    showCheck.value = false;
  }
};
const closeUpdate = () => {
  showUpdate.value = false;
};

const closeCheck = ()=>{
  showCheck.value = false;
}

const updateModel = () => {
  showUpdate.value = false;
  getAllDef();
};
//// search by group and student =>


const UpdateBranch = (id)=>{
  getAllCourses(id)
}

const UpdateCourse = (id)=>{
  getAllGroups(id);
}

const UpdateGroup = (id)=>{
  getAllStudents(id);
}
const searchFun = () => {
  getAllDef()
};
/// search end
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
          <h2>Talabalar to'lovi</h2>
        </div>
        <div class="box-header_item">
          <n-button @click="showCreate = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish
          </n-button>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              placeholder="Qidiruv"
              @update:value="UpdateBranch"
              v-model:value="sendData.filial_id"
              clearable
              filterable
              :options="branchesOptions"
              label-field="name"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Kurs</n-input-group-label>
            <n-select
              @update:value="UpdateCourse"
              placeholder="Qidiruv"
              v-model:value="sendData.course_id"
              clearable
              filterable
              :options="courserOptions"
              label-field="name"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Guruh</n-input-group-label>
            <n-select
              @update:value="UpdateGroup"
              placeholder="Qidiruv"
              v-model:value="sendData.group_id"
              clearable
              filterable
              :options="groupsOptions"
              label-field="name"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Talaba</n-input-group-label>
            <n-select
              v-model:value="sendData.student_id"
              placeholder="Qidiruv"
              clearable
              filterable
              :options="studentsOptions"
              label-field="fullname"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-button @click="searchFun" type="success">
            <template #icon>
              <n-icon>
                <eye-icon />
              </n-icon>
            </template>
            Ko'rish
          </n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="Data"
        :bordered="true"
        :single-line="false"
        style="min-width: 1200px"
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
        style="width: calc(100vw - 15px); max-height: 900px; max-width: 950px;"
        title="Talaba to'lov "
        :bordered="false"
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
        style="width: calc(100vw - 15px); max-height: 900px; max-width: 950px;"
        title="Talaba to'lov"
        :bordered="false"
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
      v-model:show="showCheck"
      :mask-closable="false"
    >
      <n-card
        style="width: calc(100vw - 15px); max-height: 900px; max-width: 650px;"
        title="Talaba cheki"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('check')"
      >
        <ModelCheck
          @close="closeCheck"
          type="check"
          :id="checkId"
        />
      </n-card>
    </n-modal>

    <n-modal
      transform-orign="center"
      v-model:show="reportAct.studentPass.read"
      :mask-closable="false"
    >
      <n-card
        style="width: calc(100vw - 15px); max-height: 850px; max-width: 950px;"
        :title="'№' + reportAct.studentPass.id +' Talabalar to\'lovi'"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('read')"
      >
        <ModelForm
          type="read"
          :id="reportAct.studentPass.id"
        />
      </n-card>
    </n-modal>
  </section>
  <!-- create more  -->
</template>

<style scoped></style>
