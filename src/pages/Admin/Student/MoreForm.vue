<script setup>
import { ref, watch, onMounted } from "vue";

import ModelService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import StudentParents from "../../../services/studentParents.service";

import ParentIndex from "../StudentParents/Index.vue";
import Dots from "../../../components/Dots/dots.vue";

import { useMessage, useNotification } from "naive-ui";
import { useMagicKeys } from "@vueuse/core";

//// icons import start
import {
  Add20Filled as AddIcon,
  Save24Filled as SaveIcon,
} from "@vicons/fluent";
import { TrashCan as delIcon } from "@vicons/carbon";
import { Exit as ExitIcon } from "@vicons/ionicons5";
//// icons import end

//// variables
const props = defineProps(["type", "id", "defaultObeject"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const message = useMessage();
const spinBtn = ref(false);
const notification = useNotification();

const findRole = ref(localStorage.getItem("role"));
const branchID = ref(JSON.parse(localStorage.getItem("filial_id")));
const branchOption = ref([]);
const parentOption = ref([]);
const getBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const getAllParents = () => {
  StudentParents.getAll().then((res) => {
    parentOption.value = res;
  });
};
const form_data = ref({
  users: [
    {
      id: new Date().getTime(),
      phone: "998",
      fullname: "",
      role: "User",
      password: "",
      confirmPassword: "",
      parent_id: null,
      lang: "uz",
      filial_id: findRole.value != "SuperAdmin" ? branchID.value : null,
      status: "success",
    },
  ],
});

///// apppend user start
const roleAuto = ref("User");
const langAuto = ref("uz");
const numLenAuto = ref(0);
const branchAuto = ref(null);
const adder = () => {
  form_data.value.users.push({
    id: new Date().getTime(),
    phone: "998",
    fullname: "",
    role: roleAuto.value,
    password: "",
    confirmPassword: "",
    lang: langAuto.value,
    filial_id:
    findRole.value != "SuperAdmin" ? branchID.value : branchAuto.value,
    status: "success",
    parent_id:null
  });
};
const oneAdd = () => {
  if (numLenAuto.value > 0) {
    for (let i = 0; i < numLenAuto.value; i++) {
      adder();
    }
    numLenAuto.value = 0;
  } else {
    adder();
  }
};
const delFunction = (id) => {
  const index = form_data.value.users.findIndex((item) => item.id == id);
  form_data.value.users.splice(index, 1);
};

const updateLang = ($event, id) => {
  const index = form_data.value.users.findIndex((item) => item.id == id);
  if ($event) {
    form_data.value.users[index].lang = "ru";
  } else {
    form_data.value.users[index].lang = "uz";
  }
};

onMounted(() => {
  getBranches();
  getAllParents();
});

///// append user end
const checkValidation = (value, name, id) => {
  if (value == null || value == "" || (id == 2 && value.length <= 8)) {
    return "error";
  }
};
const save = async () => {
  try {
    if (props.type == "create") {
      ModelService.createMore(form_data.value)
        .then((res) => {
          emit("create", res);
          spinBtn.value = false;
        })
        .catch(() => {
          spinBtn.value = false;
        });
    }
  } catch (e) {}
};

const exitBtn = () => {
  emit("close");
};
// swicht start

const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#253e35";
    if (focused) {
      style.boxShadow = "0 0 0 2px #253e35";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};

//swtich

///// phone number format and parse function
const phoneFormat = (value) => {
  let idx = !value || /^\d+$/.test(value);
  if (!idx) {
    message.warning("Iltimos raqam kiriting");
  }
  return idx;
};
//////////////////////////////////////////////
const { F4 /* keys you want to monitor */ } = useMagicKeys();
watch(F4, (v) => {
  oneAdd();
});
//// index import start
const ParentsName = ref("");
const showParents = ref(false);
const showParentsForm = ref(null);
const parentIndex = ref(null)
const showParentsBtn = (index) => {
  showParents.value = true;
  parentIndex.value = index;
  showParentsForm.value = 0;
};
const searchParents = (name) => {
  ParentsName.value = name;
};
const chooseParents = (id) => {
  form_data.value.users[parentIndex.value].parent_id = id;
  showParents.value = false;
  showParentsForm.value = 0;
  getAllParents();
};
const keyParent = (e) => {
  if (e.code == "F8") {
    showParents.value = true;
    showParentsForm.value = 0;
  } else if (e.code == "NumpadAdd") {
    showParents.value = true;
    showParentsForm.value = 1;
  }
};
//// index import end
</script>
<template>
  <div class="auto-height">
    <n-spin :show="spinBtn">
      <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data">
        <div class="table-header">
          <div class="table-header_item">
            <n-input-group>
              <n-input-group-label> Soni </n-input-group-label>
              <n-input-number
                :min="0"
                v-model:value="numLenAuto"
                clearable
              ></n-input-number>
            </n-input-group>
          </div>

          <div class="table-header_item" v-if="findRole == 'SuperAdmin'">
            <n-input-group>
              <n-input-group-label> Filial </n-input-group-label>
              <n-select
                :options="branchOption"
                v-model:value="branchAuto"
                label-field="name"
                value-field="id"
                placeholder="Tanlang"
                style="min-width: 150px"
              />
            </n-input-group>
          </div>
          <div class="table-header_item">
            <n-switch :rail-style="railStyle">
              <template #checked> Russian </template>
              <template #unchecked> Uzbek </template>
            </n-switch>
          </div>

          <div class="table-header_item">
            <n-button @click="oneAdd" type="success">
              <template #icon>
                <n-icon>
                  <AddIcon />
                </n-icon>
              </template>
              Qo'shish <span class="Insert-key">F4</span>
            </n-button>
          </div>
        </div>
        <div class="table-scroll">
          <n-table :bordered="false" :single-line="false">
            <thead class="table-scroll-top">
              <tr>
                <th>№</th>
                <th>To'liq isim sharfi</th>
                <th>Telefon raqam</th>
                <th>Ota ona</th>
                <th>Parol</th>
                <th>Qayta parol</th>
                <th>Tili</th>
                <th v-if="findRole == 'SuperAdmin'">Filial</th>
                <th>Amal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form_data.users">
                <td>{{ index + 1 }}</td>
                <td>
                  <n-input
                    v-model:value="item.fullname"
                    :maxlength="50"
                    :status="checkValidation(item.fullname, 'F.I.O', 1)"
                    show-count
                    clearable
                  />
                </td>
                <td>
                  <n-input-group>
                    <n-input-group-label>
                      <n-icon>
                        <AddIcon />
                      </n-icon>
                    </n-input-group-label>
                    <n-input
                      :allow-input="phoneFormat"
                      v-model:value="item.phone"
                      :maxlength="30"
                      :status="checkValidation(item.phone, 'Telefon', 2)"
                      show-count
                      clearable
                    />
                  </n-input-group>
                </td>
                <td>
                  <n-input-group>
                    <n-select
                      @search="searchParents"
                      @keydown="keyParent"
                      :options="parentOption"
                      label-field="fullname"
                      value-field="id"
                      style="min-width: 150px"
                      :status="checkValidation(item.parent_id, 'parent_id')"
                      placement="top"
                      filterable
                      v-model:value="item.parent_id"
                    >
                      <template #action>
                        <p style="text-align: center">Ro'yxatni ko'rish "F4"</p>
                      </template>
                      <template #empty>
                        <p style="text-align: center">
                          Qo'shish uchun "Insert"
                        </p>
                      </template>
                    </n-select>
                    <n-button
                      @click="showParentsBtn(index)"
                      type="success"
                      :style="{ padding: '0px 8px' }"
                    >
                      <Dots />
                    </n-button>
                  </n-input-group>
                </td>
                <td>
                  <n-input
                    type="password"
                    show-password-on="mousedown"
                    v-model:value="item.password"
                    :minlength="3"
                    :status="checkValidation(item.password, 'Parol', 4)"
                    show-count
                    clearable
                  />
                </td>
                <td>
                  <n-input
                    type="password"
                    show-password-on="mousedown"
                    v-model:value="item.confirmPassword"
                    :minlength="3"
                    :status="
                      checkValidation(item.confirmPassword, 'Qayta parol', 5)
                    "
                    show-count
                    clearable
                  />
                </td>
                <td>
                  <n-switch
                    @update:value="updateLang($event, item.id)"
                    :rail-style="railStyle"
                  >
                    <template #checked> Russian </template>
                    <template #unchecked> Uzbek </template>
                  </n-switch>
                </td>
                <td v-if="findRole == 'SuperAdmin'">
                  <n-select
                    :options="branchOption"
                    style="min-width: 150px"
                    label-field="name"
                    value-field="id"
                    :status="checkValidation(item.filial_id, 'Filil', 6)"
                    v-model:value="item.filial_id"
                  />
                </td>
                <td>
                  <n-button @click="delFunction(item.id)" type="error">
                    <template #icon>
                      <n-icon size="24">
                        <delIcon />
                      </n-icon>
                    </template>
                  </n-button>
                </td>
              </tr>
            </tbody>
          </n-table>
        </div>
        <n-divider :style="{ margin: '8px 0px' }"></n-divider>
        <div class="table-footer">
          <div class="table-footer_item">
            <n-button @click="exitBtn" type="warning">
              <template #icon>
                <n-icon>
                  <ExitIcon />
                </n-icon>
              </template>
              Chiqish
            </n-button>
          </div>
          <div class="table-footer_item">
            <n-button @click="save" type="success">
              <template #icon>
                <n-icon>
                  <SaveIcon />
                </n-icon>
              </template>
              Saqlash
            </n-button>
          </div>
        </div>
      </n-form>
      <!-- select adds start-->
      <n-modal
        v-model:show="showParents"
        preset="card"
        style="max-width: calc(100% - 35px)"
        transform-orign="center"
      >
        <div class="no-padding">
          <parent-index
            @select="chooseParents"
            :action="showParentsForm"
            :itemValue="ParentsName"
          ></parent-index>
        </div>
      </n-modal>
      <!-- select adds end -->
    </n-spin>
  </div>
</template>

<style scoped>
.table-scroll {
  height: calc(100vh - 300px);
  overflow: hidden;
  overflow: auto;
}
.table-scroll-top {
  position: sticky !important;
  top: 0 !important;
}
.auto-height {
  height: 100%;
}
.table-header {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 12px;
}
</style>
