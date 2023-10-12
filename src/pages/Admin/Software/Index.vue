<script setup>
import { ref, onMounted, watch, reactive, h, inject } from "vue";
import ModelService from "../../../services/softwarePayment.service";

import { useMagicKeys } from "@vueuse/core";
import { useMessage, NButton, NIcon } from "naive-ui";

import ModelForm from "./Form.vue";

import { Pen as PenICon } from "@vicons/carbon";

const emits = defineEmits(["select"]);
const props = defineProps(["type", "action", "itemValue"]);


const message = useMessage();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const dayJS = inject('dayJS')
const data = ref([]);
const loading = ref(true);



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
    title: "To'lov vaqti",
    key: "pay_date",
    resizable: true,
    sortOrder: true,
    render(row){
      return dayJS(row.pay_date * 1000).format('YYYY-MM-DD hh:mm:ss')
    }
  },
  {
    title: "Keyingi to'lov",
    key: "next_date",
    resizable: true,
    sortOrder: true,
    render(row){
      return dayJS(row.next_date * 1000).format('YYYY-MM-DD hh:mm:ss')
    }
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
      ];
    },
  },
]);

const getAll = () => {
  ModelService.getAll().then((res) => {
    loading.value = false;
    data.value = res;
  });
};



onMounted(() => {
  getAll()
});

//// render select function start


//// render select function end
/////  create and update functions

const showClose = (e) => {
  if (e == "update") {
    showUpdate.value = false;
  }
};

const updateModel = (res) => {
  showUpdate.value = false;
};


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
          <h2>Dastur to'lovi</h2>
        </div>
        <!-- <div class="box-header_item">
          <n-button @click="showCreate = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish <span class="Insert-key">Insert</span>
          </n-button>
        </div> -->
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
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="To'lovni o'zgartirish"
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
