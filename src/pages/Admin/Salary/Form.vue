<script setup>
import { ref, onMounted, h } from "vue";

import ModelService from "../../../services/salary.service";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";

import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import Dots from "../../../components/Dots/dots.vue";
import UsersIndex from "../Users/Index.vue";

const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref("");
const spinBtn = ref(false);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

////// select options
const employeeOptions = ref([]);
const branchOptions = ref([]);
/////  select options

const form_data = ref({
  user_id: null,
  role: "",
  price_type: "Percentage",
  salary: null,
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
});

const getAllTeachers = (branch) => {
  const sendData = {
    filial_id: branch ? branch : findBranch.value,
  };
  console.log(sendData)
  UserService.getSalaryTeachers(sendData).then((res) => {
    console.log(res)
    employeeOptions.value = res;
  });
};

const priceType = ref([
  {
    label: "Foizlik",
    value: "Percentage",
  },
  {
    label: "Oylik",
    value: "Monthly",
  },
]);

const rules = {
  user_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Iltimos xodimni tanlang");
      }
    },
  },
  role: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Iltimos huquqni tanlang");
      }
    },
  },
  price_type: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Iltimos oylik turni tanlang");
      }
    },
  },
  salary: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Iltimos oylik qiymatni kiriting");
      }
    },
  },
};

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};

const updateBranch = (branch) => {
  getAllTeachers(branch);
};

onMounted(() => {
  getAllBranches();
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      getAllTeachers(res.filial_id);
    });
  } else if (props.type == "create") {
    getAllTeachers();
  }
});

const exit = () => {
  emit("close");
};

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "update") {
      ModelService.update(props.id, form_data.value).then((res) => {
        emit("update", res);
      });
    } else if (props.type == "create") {
      ModelService.create(form_data.value).then((res) => {
        emit("create", res);
      });
    }
  } catch (e) {}
};
///// choose employees and send API role;

const ChooseEmployee = (id) => {
  UserService.getOne(id).then((res) => {
    form_data.value.role = res.role;
  });
};
///
///// input format numbers
const format = (value) => {
  if (value === null) return "";
  return `${value.toLocaleString("ru-RU")}`;
};
const parse = (input) => {
  const nums = input.replace(/(,|\$|\s)/g, "").trim();
  if (/^\d+(\.(\d+)?)?$/.test(nums)) return Number(nums);
  return nums === "" ? null : Number.NaN;
};
/////////////////////////

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
        [
          h("div", null, [option.fullname]),
          h("div", null, [option.branch.name]),
          h("div", null, [
            option.role == "User"
              ? "Talaba"
              : option.role == "Teacher"
              ? "O'qituvchi"
              : option.role == "Admin"
              ? "Admin"
              : "",
          ]),
        ]
      ),
    ]
  );
};
//// render select function end

///// choose user function start
const userName = ref("");
const showUser = ref(false);
const showUserForm = ref(null);

const chooseUser = (data) => {
  form_data.value.user_id = data.id;
  showUser.value = false;
  getAllTeachers();
};
const AdduserIndex = () => {
  showUser.value = true;
  showUserForm.value = 2;
};
const UserKey = (e) => {
  if (e.code == "F4") {
    AdduserIndex();
  } else if (e.code == "Insert") {
    showUser.value = true;
    showUserForm.value = 3;
  }
};
const UserSearch = (user) => {
  userName.value = user;
};
///// choose user function end
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <n-spin size="large" :show="spinBtn">
        <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="12" :y-gap="4">
          <n-grid-item v-if="findRole == 'SuperAdmin' ? true : false">
            <n-form-item label="Filial" path="filial_id">
              <n-input-group>
                <n-select
                  :options="branchOptions"
                  label-field="name"
                  value-field="id"
                  v-model:value="form_data.filial_id"
                  @update:value="updateBranch"
                  clearable
                  filterable
                >
                  <template #action>
                    <p style="text-align: center">Ro'yxatni ko'rish "F4"</p>
                  </template>
                  <template #empty>
                    <p style="text-align: center">Qo'shish uchun "Insert"</p>
                  </template>
                </n-select>
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger>
                    <n-button
                      @click="AdduserIndex"
                      type="success"
                      :style="{ padding: '0px 8px' }"
                    >
                      <template #icon>
                        <Dots />
                      </template>
                    </n-button>
                  </template>
                  <span> Xodim qo'shish </span>
                </n-tooltip>
              </n-input-group>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Xodim" path="user_id">
              <n-input-group>
                <n-select
                  @update:value="ChooseEmployee"
                  :options="employeeOptions"
                  @keydown="UserKey"
                  @search="UserSearch"
                  label-field="fullname"
                  value-field="id"
                  :render-label="renderUser"
                  :render-tag="renderUserSelect"
                  v-model:value="form_data.user_id"
                  clearable
                  filterable
                >
                  <template #action>
                    <p style="text-align: center">Ro'yxatni ko'rish "F4"</p>
                  </template>
                  <template #empty>
                    <p style="text-align: center">Qo'shish uchun "Insert"</p>
                  </template>
                </n-select>
                <n-tooltip placement="right" trigger="hover">
                  <template #trigger>
                    <n-button
                      @click="AdduserIndex"
                      type="success"
                      :style="{ padding: '0px 8px' }"
                    >
                      <template #icon>
                        <Dots />
                      </template>
                    </n-button>
                  </template>
                  <span> Xodim qo'shish </span>
                </n-tooltip>
              </n-input-group>
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Oylik turi" path="price_type">
              <n-select
                :options="priceType"
                v-model:value="form_data.price_type"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          <n-grid-item v-if="form_data.price_type == 'Monthly'">
            <n-form-item label="Oylik summa" path="salary">
              <n-input-number
                v-model:value="form_data.salary"
                :step="100000"
                :min="0"
                :format="format"
                :parse="parse"
                :style="{ width: '100%' }"
              ></n-input-number>
            </n-form-item>
          </n-grid-item>
          <n-grid-item v-else>
            <n-form-item label="Oylik foiz" path="salary">
              <n-input-number
                v-model:value="form_data.salary"
                :max="100"
                :min="0"
                :format="format"
                :parse="parse"
                :style="{ width: '100%' }"
              >
                <template #suffix> % </template>
              </n-input-number>
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-divider :style="{ margin: '12px 0px' }"></n-divider>
        <div class="btn-action">
          <n-button @click="exit" type="warning">
            <template #icon>
              <exit-icon />
            </template>
            Chiqish
          </n-button>
          <n-button @click="save" type="success">
            <template #icon>
              <n-icon>
                <save-icon />
              </n-icon>
            </template>
            Saqlash
          </n-button>
        </div>
      </n-spin>
    </n-form>
    <!-- User index start -->
    <n-modal
      transform-orign="center"
      v-model:show="showUser"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <UsersIndex
        @select="chooseUser"
        :action="showUserForm"
        :item-value="userName"
      >
      </UsersIndex>
    </n-modal>
    <!-- User index end -->
  </div>
</template>

<style scoped>
.btn-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
}

.d-flex-row {
  display: flex;
  align-items: center;
  gap: 12px;
  margin: 7px 0px;
}

.padding {
  padding: 0px 8px;
}
</style>
