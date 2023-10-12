<script setup>
import { h, ref, onMounted, inject, reactive } from "vue";
import ModelService from "../../../services/teacherSalary.service";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import { NButton, NIcon } from "naive-ui";
import ModelForm from "./Form.vue";
import { Add20Filled as AddIcon } from "@vicons/fluent";
import { Pen as PenICon } from "@vicons/carbon";
import { useReportData } from "../../../stores/report";

const reportAct = useReportData();
const dayJS = inject("dayJS");
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const Data = ref([]);
const loading = ref(true);

const teacherOptions = ref([]);
const branchOptions = ref([]);


const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const searchData = ref({
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  teacher_id: null,
})



const getAllDef = () => {
  loading.value = true;
  ModelService.searchModel(searchData.value).then((res) => {
    Data.value = res;
    loading.value = false;
  });
};

const getAllTeachers = (branch) => {
  let sendData = {
    filial_id: findRole.value == "SuperAdmin" ? branch : findBranch.value,
    role: "Teacher",
  };
  UserService.getAll(sendData).then((res) => {
    teacherOptions.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};
const columns = ref([
  {
    title: "№",
    key: "id",
    width: 50,
    align: "center",
  },
  {
    title: "Sanasi",
    key: "datetime",
    resizable: true,
    render(row) {
      return dayJS(row.datetime * 1000).format("YYYY-MM-DD HH:mm:ss");
    },
  },
  {
    title: "O'qituvchi",
    key: "teacher.fullname",
    resizable: true,
  },

  {
    title: "Kurs",
    key: "course.name",
    resizable: true,
  },
  {
    title: "Kurs narxi",
    key: "course_price",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.course_price);
    },
  },

  {
    title: "Talaba soni",
    key: "student_count",
    resizable: true,
  },
  {
    title: "Oyligi ",
    key: "all_sum",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.all_sum);
    },
  },

  {
    title: "To'landi",
    key: "pay_summa",
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.pay_summa);
    },
  },
  {
    title: "Filial",
    key: "filial.name",
    resizable: true,
  },
  {
    title: "Izoh",
    key: "comment",
    resizable: true,
  },
  {
    title: "Amal",
    key: "action",
    width: 60,
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
        //         content: `${row.id} Rostan ham o'chirasizmi`,
        //         positiveText: "Xa",
        //         negativeText: "Yo'q",
        //         onPositiveClick: () => {
        //           ModelService.delete(row.id)
        //             .then((res) => {
        //               const index = Data.value.findIndex(
        //                 (val) => val.id == row.id
        //               );
        //               Data.value.splice(index, 1);
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
  getAllDef();
  getAllTeachers();
  getAllBranches();
});
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
  } else if (e == "read") {
    reportAct.teacherPass.read = false;
  }
};
const closeUpdate = () => {
  showUpdate.value = false;
};
const updateModel = () => {
  showUpdate.value = false;
  getAllDef();
};
//// search by  teacher =>

const chooseBranch = (id) => {
  searchData.value.teacher_id = null;
  getAllTeachers(id);
};
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
          <h2>O'qituvchilar to'lovi</h2>
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
              placeholder="Qidiruv"
              v-model:value="searchData.filial_id"
              @update:value="chooseBranch"
              clearable
              filterable
              :options="branchOptions"
              label-field="name"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>O'qituvchi</n-input-group-label>
            <n-select
              v-model:value="searchData.teacher_id"
              placeholder="Qidiruv"
            
              clearable
              filterable
              :options="teacherOptions"
              label-field="fullname"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-button @click="searchFun" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :columns="columns"
        :pagination="pagination"
        :data="Data"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1200px"
        max-height="calc(100vh - 300px)"
      >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <!-- create  -->
    <n-modal
      transform-orign="center"
      v-model:show="showCreate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 1000px; width: calc(100vw - 15px); max-height: 900px"
        title="To'lov qo'shish"
        :bordered="false"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm @close="closeCreate" @create="createModel" type="create" />
      </n-card>
    </n-modal>
    <!-- update -->
    <n-modal
      transform-orign="center"
      v-model:show="showUpdate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 1000px; width: calc(100vw - 15px); max-height: 900px"
        title="To'lovni o'zgartirish"
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

    <!-- read only -->
    <n-modal
      transform-orign="center"
      v-model:show="reportAct.teacherPass.read"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 1000px; width: calc(100vw - 15px); max-height: 900px"
        :title="'№' + reportAct.teacherPass.id + ' O\'ituvchi to\'lovi'"
        :bordered="true"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('read')"
      >
        <ModelForm type="read" :id="reportAct.teacherPass.id" />
      </n-card>
    </n-modal>
  </section>
</template>

<style scoped></style>
