;width:calc(100vw - 35px)<script setup>
import { ref, onMounted, watch, reactive, h } from "vue";
import { useMagicKeys } from "@vueuse/core";
import { useMessage, useDialog, NButton, NIcon} from "naive-ui";

import ModelService from "../../../services/payType.service";

import ModelForm from "./Form.vue";

import {
  Add20Filled as AddIcon,
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
const payTypeOptions = ref([]);
const loading = ref(false);


const findRole = ref(localStorage.getItem('role'));
const findBranch = ref(JSON.parse(localStorage.getItem('filial_id')));

const searchData = ref({
  type_id: null
})

const getAll = () => {
  ModelService.getAll(searchData.value).then((res) => {
    data.value = res;
  });
};

const getAllType = ()=>{
  ModelService.getAll().then((res) => {
    payTypeOptions.value = res;
  });
}


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
    sortOrder:true,
    sorter: "default",
  },
  {
    title: "Amallar",
    key: "action",
    width: 110,
    render(row) {
      if(!row.status){
        return [
          h(
            NButton,
            {
              size: "small",
              type: "success",
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
              },
              onClick: (e) => {
                dialog.warning({
                  title: "Ogohlantirish",
                  content: `${row.name} Rostan ham o'chirasizmi`,
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
                    message.error("Ma'lumot o'chirilmadi");
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
      }
    },
  },
])

onMounted(() => {
  getAll();
  getAllType();
});
/////  create and update functions
const createModel = () => {
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

const updateModel = () => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  getAll();
};


//// search function start


const searchBtn = () => {
  getAll()
};
//// search function end
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
</script>

<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <h2>To'lov turi</h2>
        <n-button v-if="false" @click="showCreate = true" type="success">
          <template #icon>
            <n-icon size="18">
              <AddIcon />
            </n-icon>
          </template>
          Qo'shish <span class="Insert-key">Insert</span>
        </n-button>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>To'lov turi</n-input-group-label>
            <n-select
              v-model:value="searchData.type_id"
              :options="payTypeOptions"
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
        >
      </n-data-table>
    </div>
  </div>
  <!-- Modal create and Update -->
  <section>
    <n-modal v-model:show="showCreate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px;width:calc(100vw - 35px)"
        title="To'lov  turi qo'shish"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="showClose('create')"
      >
        <ModelForm @create="createModel" type="create" />
      </n-card>
    </n-modal>
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px;width:calc(100vw - 35px)"
        title="To'lov  turi o'zgartirish"
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


