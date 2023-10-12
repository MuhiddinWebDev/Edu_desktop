<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import ModelService from "../../../services/room.service";
import BranchService from "../../../services/branch.service";

import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NButton, NIcon } from "naive-ui";

import ModelForm from "./Form.vue";

import {
  Add20Filled as AddIcon,
  PersonEdit24Filled as PersonIcon,
} from "@vicons/fluent";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";

const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue"]);

const message = useMessage();
const dialog = useDialog();

const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const data = ref([]);
const roomName = ref("");
const branchOption = ref([]);
const roomOption = ref([]);
const loading = ref(true);

const branchId = ref(null);
const roomId = ref(null);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

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
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder: true,
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
        //         content: `${row.name}ni rostan ham o'chirasizmi`,
        //         positiveText: "Xa",
        //         negativeText: "Yo'q",
        //         onPositiveClick: () => {
        //           ModelService.delete(row.id)
        //             .then((res) => {
        //               const index = branch.value.findIndex(
        //                 (val) => val.id == row.id
        //               );
        //               branch.value.splice(index, 1);
        //               message.success("Ma'lumot o'chirildi");
        //             })
        //             .catch((err) => {
        //               message.error("Ma'lumot o'chirilmadi");
        //             });
        //         },
        //         onNegativeClick: () => {
        //           message.warning("Bekor qilindi");
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

const getAll = (room_id, branch_id) => {
  const send_data = {
    id: room_id,
    filial_id: branch_id ? branch_id : findBranch.value,
  };
  ModelService.searchModel(send_data).then((res) => {
    loading.value = false;
    data.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

const getAllRooms = (room_id, branch_id) => {
  const send_data = {
    id: room_id,
    filial_id: branch_id ? branch_id : findBranch.value,
  };
  ModelService.searchModel(send_data).then((res) => {
    roomOption.value = res;
  });
};

onMounted(() => {
  if (props.action) {
    showCreate.value = true;
    roomName.value = props.itemValue;
  }
  if (findRole.value == "SuperAdmin") {
    getAllBranches();
    getAll(null, null);
    getAllRooms(null, null);
  }
  if (findRole.value != "SuperAdmin") {
    getAllRooms(null, findBranch.value);
    getAll(null, findBranch.value);
  }
});

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
//// render select function end
/////  create and update functions
const createModel = (res) => {
  showCreate.value = false;
  message.success("Ma'lumot qo'shildi");
  if (findRole.value == "SuperAdmin") {
    getAll(null, null);
  } else {
    getAll(null, findBranch.value);
  }
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }
};

const updateModel = (res) => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  if (findRole.value == "SuperAdmin") {
    getAll(null, null);
  } else {
    getAll(null, findBranch.value);
  }
};

//// selected rooms
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      emits("select", row.id);
    },
  };
};
//// search function start;
const UpdateBranch = (branch_id) => {
  roomId.value = null;
  getAllRooms(null, branch_id);
};

const searchBtn = () => {
  getAll(roomId.value, branchId.value);
};
//// search function end;

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
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Xonalar</h2>
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
              :options="branchOption"
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
            <n-input-group-label>Xona</n-input-group-label>
            <n-select
              v-model:value="roomId"
              :options="roomOption"
              :render-label="renderRoom"
              :render-tag="renderRoomSelect"
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
          <n-button @click="searchBtn" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :row-props="rowProps"
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
    <n-modal v-model:show="showCreate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="Xona qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm
          @create="createModel"
          type="create"
          :defaultname="roomName"
        />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="Xonani o'zgartirish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('update')"
      >
        <ModelForm type="update" :id="updateId" @update="updateModel" />
      </n-card>
    </n-modal>
  </section>
</template>

<style scoped>
.header_item {
  display: flex;
  align-items: center;
  gap: 6px;
}
</style>
