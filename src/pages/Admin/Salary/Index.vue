<script setup>
import { h, ref, onMounted, watch, reactive  } from "vue";
import ModelService from "../../../services/salary.service";
import { NButton, NIcon, useMessage, useDialog } from "naive-ui";
import { useMagicKeys } from "@vueuse/core";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import ModelForm from "./Form.vue";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";
import { Add20Filled as AddIcon } from "@vicons/fluent";
const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const Getdata = ref([]);
const loading = ref(true);
const branchOptions = ref([]);
const emoployeeOptions = ref([]);
const userID = ref(null);
const branchID = ref(null);

const findRole = ref(localStorage.getItem('role'));
const findBranch = ref(JSON.parse(localStorage.getItem('filial_id')));

const searchData = ref({
  role:'Xodim',
  filial_id: findRole.value == 'SuperAdmin' ? null: findBranch.value,
  user_id: userID.value
})

const getAllDef = () => {
  loading.value = true;
  ModelService.getAll(searchData.value).then((res) => {
    Getdata.value = res;
    loading.value = false;
  });
};

const getAllOptions = () => {
  UserService.getAll(searchData.value).then((res) => {
    emoployeeOptions.value = res;
  });
};

const getAllBranches = ()=>{
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  })
}

const updateBranch = (e)=>{
  getAllOptions();
}


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
    title: "Xodim",
    key: "user.fullname",
    resizable: true,
    sortOrder:true,
    sorter:(row1, row2) => row1.user.id - row2.user.id,
  },
  {
    title: "Huquqi",
    key: "role",
    resizable: true,
    render(row) {
      if (row.role == "Teacher") {
        return "O'qituvchi";
      }else if( row.role =='SuperAdmin'){
        return "Super Admin";
      }else{
        return row.role;
      }
    },
  },
  {
    title: "Oylik turi",
    key: "price_type",
    resizable: true,
    sortOrder:true,
    sorter:"default",
    render(row) {
      if (row.price_type == "Monthly") {
        return "Oylik";
      } else {
        return "Foizlik";
      }
    },
  },
  {
    title: "Oylik",
    sortOrder:true,
    align:'right',
    sorter:"default",
    render(row) {
      if (row.price_type == "Monthly") {
        return  new Intl.NumberFormat('ru-RU',{
          style:'decimal'
        }).format(row.salary) ;
      } else {
        return 0;
      }
    },
  },
  {
    title: "Foizlik",
    sortOrder:true,
    align:'right',
    sorter:"default",
    render(row) {
      if (row.price_type != "Monthly") {
        return `${row.salary}%`;
      } else {
        return 0;
      }
    },
  },
  {
    title: "Filial",
    key: "branch.name",
    sortOrder:true,
    sorter: (row1, row2) => row1.branch.id - row2.branch.id,
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
        //         content: `${
        //           Getdata.value.findIndex((item) => item.id == row.id) + 1
        //         } Rostan ham o'chirasizmi`,
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
  getAllDef();
  getAllOptions();
  getAllBranches();
  // if(findRole != 'SuperAdmin'){
  //   let index = columns.value.findIndex((item) => item.title == 'Filial');
  //   columns.value.splice(index, 1)
  // }
});
///  create and update functions
const closeCreate = () => {
  showCreate.value = false;
};
const createModel = (res) => {
  showCreate.value = false;
  Getdata.value = [];
  getAllDef();
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }
};
const closeUpdate = () => {
  showUpdate.value = false;
};
const updateModel = () => {
  showUpdate.value = false;
  Getdata.value = [];
  getAllDef();
};
//// search function start
const searchFunction = () => {
  getAllDef();
};
const ClearData = (e) => {
  getAllDef();
};
/// search function end

///// window key event start
const { insert /* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v) showCreate.value = true;
});
//// window key event end

//// render select function start
const renderUserSelect = ({ option }) => {
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
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.fullname]),  h("div", null, [option.role == "User"  ? "Talaba": option.role == "Teacher" ? "O'qituvchi": option.role == "Admin" ? "Admin": option.role == "SuperAdmin" ? 'Super Admin' :''])],
        [h("div", null, [ findRole.value == 'SuperAdmin' ? 'Filial: ' + option.branch.name : ''])]
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
      }
});
///// pagination end

</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Xodimlar oyligi</h2>
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
              @clear="ClearData"
              v-model:value="searchData.filial_id"
              placeholder="Qidiruv"
              clearable
              filterable
              :options="branchOptions"
              @update:value ="updateBranch"
              label-field="name"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Xodim</n-input-group-label>
            <n-select
              @clear="ClearData"
              v-model:value="searchData.user_id"
              placeholder="Qidiruv"
              clearable
              filterable
              :options="emoployeeOptions"
              :render-label="renderUser"
              :render-tag="renderUserSelect"
              label-field="fullname"
              value-field="id"
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-button @click="searchFunction" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :pagination="pagination"
        :columns="columns"
        :data="Getdata"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 800px"
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
        style="max-width: 900px; width: calc(100vw - 35px); "
        title="Oylik qo'shish"
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
        style="max-width: 900px; width: calc(100vw - 35px); "
        title="Oylikni o'zgartirish"
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

<style scoped></style>
