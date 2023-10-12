<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import ModelService from "../../../services/studentParents.service";
import BranchService from "../../../services/branch.service";

import { useMagicKeys } from "@vueuse/core";
import { useMessage, NButton, NIcon, useDialog } from "naive-ui";

import ModelForm from "./Form.vue";

import {
  Add20Filled as AddIcon,
} from "@vicons/fluent";
import { Pen as PenICon, TrashCan as TrashIcon } from "@vicons/carbon";

const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue"]);

const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const data = ref([]);
const parentFullname = ref("");
const parentsOptions = ref([]);
const loading = ref(true);

const findDev = ref(localStorage.getItem('phone'))

const formatUzbekPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");

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
    title: "F.I.O",
    key: "fullname",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Tefon",
    key: "phone",
    resizable: true,
    sortOrder: true,
    render(row){
      const formatPhone = row.phone;
      return "+" + formatUzbekPhoneNumber(formatPhone);
    }
  },
  {
    title: "Manzil",
    key: "address",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Amallar",
    key: "action",
    width: findDev.value == '998907788769' ? 110:70,
    render(row) {
      return [
        h(
          NButton,
          {
            size: "small",
            type: "success",
            block: findDev.value == '998907788769' ? false:true,
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
        h(
          NButton,
          {
            size: "small",
            type: "error",

            style: {
              marginLeft: "8px",
              display: findDev.value == '998907788769' ? '':'none'
            },
            onClick: (e) => {
              dialog.warning({
                title: "Ogohlantirish",
                content: `${row.fullname }ni rostan ham o'chirasizmi`,
                positiveText: "Xa",
                negativeText: "Yo'q",
                onPositiveClick: () => {
                  ModelService.delete(row.id)
                    .then((res) => {
                      const index = data.value.findIndex(
                        (val) => val.id == row.id
                      );
                      data.value.splice(index, 1);
                      message.success("Ma'lumot o'chirildi");
                    })
                    .catch((err) => {
                      message.error("Ma'lumot o'chirilmadi");
                    });
                },
                onNegativeClick: () => {
                  message.warning("Bekor qilindi");
                },
              });
            },
          },
          {
            icon: () =>
              h(NIcon, {
                component: TrashIcon,
              }),
          }
        ),
      ];
    },
  },
]);

const getAll = (parent_id) => {
  let searchData = {
    parent_id: parent_id
  }
  console.log(searchData)
  ModelService.getAll(searchData).then((res) => {
    loading.value = false;
    data.value = res;
  });
};


const getAllParents = () => {
  ModelService.getAll().then((res) => {
    parentsOptions.value = res;
  });
};

onMounted(() => {
  if (props.action) {
    showCreate.value = true;
    parentFullname.value = props.itemValue;
  }
  getAll();
  getAllParents();
});


/////  create and update functions
const createModel = (res) => {
  showCreate.value = false;
  message.success("Ma'lumot qo'shildi");
  getAll();
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
  getAll();
};
//// search function start
const UpdateParents = (parent_id)=>{
  getAll(parent_id)
}
/// search function end


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
          <h2>Ota onalar</h2>
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
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Ota-onalar</n-input-group-label>
            <n-select
              :options="parentsOptions"
              label-field="fullname"
              @update:value="UpdateParents"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            >
            </n-select>
          </n-input-group>
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
        max-height="50vh"
        style="min-width: 1000px;"
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
        title="Ota-onalar qo'shish"
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
          :defaultname="parentFullname"
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
