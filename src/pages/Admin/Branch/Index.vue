<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";

import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NButton, NIcon, NSwitch } from "naive-ui";

import ModelService from "../../../services/branch.service";
import ModelForm from "./Form.vue";

import { Add20Filled as AddIcon } from "@vicons/fluent";
import { TrashCan as TrashIcon, Pen as PenICon } from "@vicons/carbon";

const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue"]);

const message = useMessage();
const dialog = useDialog();
const loading = ref(true);

const formatUzbekPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");

  // Check if the phone number is valid
  const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);

  if (match) {
    // Format the phone number as +998 XX YYY YYYY
    return `998 ${match[1]}  ${match[2]}  ${match[3].slice(
      0,
      2
    )} ${match[3].slice(2, 4)}`;
  }

  // If the phone number is not valid, return the original input
  return phoneNumber;
};

const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const branch = ref([]);
const columns = ref([
  {
    title: "№",
    key: "index",
    width: 50,
    render(row) {
      return branch.value.findIndex((item) => item.id == row.id) + 1;
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
    title: "Telefon",
    key: "phone",
    resizable: true,
    render(row) {
      const formatPhone = row.phone;
      return "+" + formatUzbekPhoneNumber(formatPhone);
    },
  },
  {
    title: "Viloyat",
    key: "region.name",
    resizable: true,
  },
  {
    title: "Shahar",
    key: "district.name",
    resizable: true,
  },
  {
    title: "Biriktirilgan",
    key: "parent.name",
    resizable: true,
  },
  {
    title: "Izoh",
    key: "comment",
    resizable: true,
  },
  {
    title: "Bosh filial",
    key: "folder",
    resizable: true,
    width:80,
    render(row) {
      return [
        h(NSwitch, {
          value: row.folder,
          disabled: true,
          round: false,
        }),
      ];
    },
  },
  {
    title: "Amallar",
    key: "action",
    width: 70,
    render(row) {
      if (branch.value.length > 1) {
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
      }
    },
  },
]);
let addPermissions = ref(0)
const getAll = () => {
  ModelService.getAll().then((res) => {
    branch.value = res;
    loading.value = false;
    addPermissions.value = res.length;
  });
};
const getAllOptions = () => {
  ModelService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const branchOption = ref([]);
const branchName = ref("");
onMounted(() => {
  getAll();
  getAllOptions();
  if (props.action) {
    showCreate.value = true;
    branchName.value = props.itemValue;
  }
});
/////  create and update functions
const createModel = () => {
  showCreate.value = false;
  branch.value = [];
  message.success("Ma'lumot qo'shildi");
  getAll();
  getAllOptions();
};
const showClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  }
};

const updateModel = () => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  branch.value = [];
  getAll();
  getAllOptions();
};
//// row click choose branch
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      emits("select", row.id);
    },
  };
};


//// search function start
const branchSearchId = ref(null);
const getAllSearch = (id) => {
  branch.value = [];
  ModelService.getAllByName(id).then((res) => {
    branch.value = res;
  });
};
const searchUpdate = (id) => {
  branchSearchId.value = id;
};
const searchBtn = () => {
  if (branchSearchId.value > 0) {
    getAllSearch(branchSearchId.value);
  } else {
    getAll();
    getAllOptions();
  }
};
const searchKey = (e) => {
  if (e.code == "Enter") {
    searchBtn();
  }
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
          <h2>Filiallar</h2>
        </div>
        <div class="box-header_item" v-if="addPermissions < 4">
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
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              @keydown="searchKey"
              v-model:value="branchSearchId"
              :options="branchOption"
              @update:value="searchUpdate"
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
        :row-props="rowProps"
        :pagination="pagination"
        :loading="loading"
        :columns="columns"
        :data="branch"
        :bordered="true"
        :single-line="false"
        size="small"
        style="min-width: 1000px"
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
        style="max-width: 800px; width: calc(100vw - 35px)"
        title="Filial qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm
          @close="showClose('create')"
          @create="createModel"
          type="create"
          :defaultname="branchName"
        />
      </n-card>
    </n-modal>
    <n-modal
      transform-orign="center"
      v-model:show="showUpdate"
      :mask-closable="false"
    >
      <n-card
      
        style="max-width: 800px; width: calc(100vw - 35px)"
        title="Fililani o'zgartirish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('update')"
      >
        <ModelForm 
          type="update" 
          :id="updateId"
          @close="showClose('update')"
          @update="updateModel" />
      </n-card>
    </n-modal>
  </section>
</template>
