<script setup>
import { ref, onMounted, h, watch, inject } from "vue";
import ModelService from "../../../services/rasxod.service";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import BecourseService from "../../../services/rasxodBecouse.service";
////// Indexs import start
import UsersIndex from "../Users/Index.vue";
import BranchIndex from "../Branch/Index.vue";
import BecouseIndex from "../RasxodBecouse/Index.vue";
/////  Indexe import end
import Dots from "../../../components/Dots/dots.vue";
import { useMagicKeys } from "@vueuse/core";
import {
  Save24Filled as SaveIcon,
  Add20Filled as AddIcon,
} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import { DeleteForeverRound as delIcon } from "@vicons/material";
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const dayJS = inject("dayJS");
const currentUser = ref(JSON.parse(localStorage.getItem("id")));
const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const form_data = ref({
  datetime: new Date().getTime(),
  summa: 0,
  user_id: findRole.value == 'SuperAdmin'? null : currentUser.value,
  filial_id: findRole.value == 'SuperAdmin'? null : findBranch.value,
  text: "",
  rasxod_table: [],
});
const formRef = ref("");
const showFeedback = ref(false);


const rules = {
  summa: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos summani kiritng");
      }
    },
  },
  user_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos shaxsni tanlang");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos filial tanlang");
      }
    },
  },
};
//// select options variables
const UserOptions = ref([]);
const BranchOptions = ref([]);
const BecouseOptions = ref([]);
//// select options variables
/// getAll response functions start
const getAllUsers = (id) => {
  let search = {
    filial_id: findRole.value == "SuperAdmin" ? id : findBranch.value,
  };
  UserService.getAll(search).then((res) => {
    UserOptions.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    BranchOptions.value = res;
  });
};
const getAllBecouse = (id) => {
  let senData = {
    filial_id: findRole.value == "SuperAdmin"? id : findBranch.value,
  }
  BecourseService.searchModel(senData).then((res) => {
    BecouseOptions.value = res;
  });
};
const BranchUpdate = (id) => {
  getAllUsers(id);
  getAllBecouse(id);
  form_data.value.user_id = null;
  form_data.value.rasxod_table;
};
/// getAll response functions end

onMounted(() => {
  if (props.type == "update" || props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      form_data.value.datetime = 1000 * form_data.value.datetime;
      getAllUsers(res.filial_id);
      getAllBecouse(res.filial_id);
    });
  }
 
  //// get user id by localstorge  start
  //// get user id end
  getAllUsers();
  getAllBranches();
  getAllBecouse();
});
const exit = () => {
  emit("close");
};
const AddRasxod = () => {
  form_data.value.rasxod_table.push({
    id: new Date().getTime(),
    becouse_id: null,
    who_id: null,
    role: "",
    price: 0,
    comment: "",
  });
};
const delBtn = (id) => {
  const index = form_data.value.rasxod_table.findIndex((item) => item.id == id);
  form_data.value.rasxod_table.splice(index, 1);
};
//// rasxod table functions start
const employeeRole = ($event, index) => {
  let id = $event;
  if (id != null) {
    UserService.getOne(id).then((res) => {
      form_data.value.rasxod_table[index].role = res.role;
    });
  }
};

const calcSumma = (summa) => {
  let price = 0;
  form_data.value.rasxod_table.forEach((item) => {
    price += item.price ? item.price : 0;
  });
  form_data.value.summa = price;
};
//// rasxod table functions end
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
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      ModelService.create(form_data.value).then((res) => {
        emit("create", res);
      });
    } else if (props.type == "update") {
      ModelService.update(props.id, form_data.value).then((res) => {
        emit("update", res);
      });
    }
  } catch (e) {}
};
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
/////// window keydown event  start
const { NumpadAdd /* keys you want to monitor */ } = useMagicKeys();
watch(NumpadAdd, (v) => {
  if (v) AddRasxod();
});
/////// window keydown event  end
/////// Choose Index function start

//// choose branch function start
const branchName = ref("");
const showBranch = ref(false);
const showBranchFrom = ref(null);
const chooseBranch = (data) => {
  form_data.value.filial_id = data;
  showBranch.value = false;
  getAllBranches();
};
const AddBranch = () => {
  showBranch.value = true;
  showBranchFrom.value = 0;
};
//// select branch keydown
const BranchKey = (e) => {
  if (e.code == "F4") {
    AddBranch();
  } else if (e.code == "Insert") {
    showBranch.value = true;
    showBranchFrom.value = 1;
  }
};
const BranchSearch = (branch) => {
  branchName.value = branch;
};
//// choose branch function end

///// choose user function start
const userName = ref("");
const showUser = ref(false);
const showUserForm = ref(null);
const chooseUser = (data) => {
  if (WhoId.value != null) {
    form_data.value.rasxod_table[WhoId.value].who_id = data.id;
  } else {
    form_data.value.user_id = data.id;
  }
  showUser.value = false;
  getAllUsers();
};
const AdduserIndex = () => {
  showUser.value = true;
  showUserForm.value = 0;
};
const UserKey = (e) => {
  if (e.code == "F4") {
    AdduserIndex();
  } else if (e.code == "Insert") {
    showUser.value = true;
    showUserForm.value = 1;
  }
};
const UserSearch = (user) => {
  userName.value = user;
};
///// choose user function end
//// Becouse index function start
const BecouseName = ref(" ");
const showBecouse = ref(false);
const showBecouseForm = ref(null);
const BecouseId = ref(null);
const chooseBecouse = (data) => {
  form_data.value.rasxod_table[BecouseId.value].becouse_id = data;
  showBecouse.value = false;
  getAllBecouse();
};
const AddBecouse = (index) => {
  showBecouse.value = true;
  showBecouseForm.value = 0;
  BecouseId.value = index;
};
const BecouseKey = ($event, index) => {
  if ($event.code == "F4") {
    AddBecouse(index);
  } else if ($event.code == "Insert") {
    showBecouse.value = true;
    showBecouseForm.value = 1;
  }
};

const BecouseSearch = (couse) => {
  BecouseName.value = couse;
};
//// Who index function end
const WhoId = ref(null);

const AddWho = (index) => {
  showUser.value = true;
  showUserForm.value = 0;
  WhoId.value = index;
};
const WhoKey = ($event, index) => {
  if ($event.code == "F4") {
    AddWho(index);
  } else if ($event.code == "Insert") {
    showUser.value = true;
    showUserForm.value = 1;
  }
};

const WhoSearch = (user) => {
  userName.value = user;
};
//// Who index function end
/////// Choose Index function end
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <div class="user-message-header">
        <n-grid cols="1 s:2 m:2 l:5" :x-gap="12" :y-gap="6" responsive="screen">
          <n-grid-item>
            <n-form-item label="Sana" path="date">
              <n-date-picker
                :style="{ width: '100%' }"
                :disabled="true"
                type="datetime"
                v-model:value="form_data.datetime"
              >
              </n-date-picker>
            </n-form-item>
          </n-grid-item>
          <n-grid-item v-if="findRole == 'SuperAdmin'">
            <n-form-item label="Filial" path="filial_id" >
              <n-input-group>
                <n-select
                  @keydown="BranchKey"
                  @search="BranchSearch"
                  @update:value="BranchUpdate"
                  v-model:value="form_data.filial_id"
                  :disabled="props.type == 'read' || props.type == 'update'"
                  :options="BranchOptions"
                  value-field="id"
                  label-field="name"
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
                <n-tooltip placement="bottom" trigger="hover">
                  <template #trigger>
                    <n-button
                      @click="AddBranch"
                      type="success"
                      :style="{ padding: '0px 8px' }"
                    >
                      <template #icon>
                        <Dots />
                      </template>
                    </n-button>
                  </template>
                  <span> Filial qo'shish</span>
                </n-tooltip>
              </n-input-group>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Masul shaxs" path="user_id">
              <n-input-group>
                <n-select
                  @keydown="UserKey"
                  @search="UserSearch"
                  :render-label="renderUser"
                  :render-tag="renderUserSelect"
                  v-model:value="form_data.user_id"
                  :options="UserOptions"
                  :disabled="props.type == 'read' || props.type == 'update'"
                  value-field="id"
                  label-field="fullname"
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
                <n-tooltip placement="bottom" trigger="hover">
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
                  <span> Masul shaxs qo'shish</span>
                </n-tooltip>
              </n-input-group>
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Summa" path="summa">
              <n-input-number
                v-model:value="form_data.summa"
                clearable
                :disabled="true"
                :format="format"
                :parse="parse"
                :min="0"
                :style="{ width: '100%' }"
              ></n-input-number>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Izoh" path="text">
              <n-input
                v-model:value="form_data.text"
                clearable
                type="text"
                :disabled="props.type == 'read'"
              >
              </n-input>
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <div class="btn-action" style="margin-bottom: 10px"  v-if="props.type != 'read'">
          <n-button @click="AddRasxod" type="success">
            <template #icon>
              <n-icon size="18">
                <AddIcon />
              </n-icon>
            </template>
            Qo'shish
          </n-button>
        </div>
        <n-scrollbar  trigger="none" x-scrollable>
          <n-table style="min-width: 850px; background-color: red ">
            <thead>
              <tr>
                <th style="max-width: 20px">N0</th>
                <th>Sababi</th>
                <th>Kimga</th>
                <th>Berilgan summa</th>
                <th>Izoh</th>
                <th v-if="props.type != 'read'">Amal</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form_data.rasxod_table">
                <td style="max-width: 20px">{{ index + 1 }}</td>
                <td>
                  <n-input-group>
                    <n-select
                      @keydown="BecouseKey($event, index)"
                      @search="BecouseSearch"
                      v-model:value="item.becouse_id"
                      :disabled="props.type == 'read'"
                      :options="BecouseOptions"
                      value-field="id"
                      label-field="name"
                      filterable
                      clearable
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
                    <n-tooltip placement="bottom" trigger="hover">
                      <template #trigger>
                        <n-button
                          @click="AddBecouse(index)"
                          type="success"
                          :style="{ padding: '0px 8px' }"
                        >
                          <template #icon>
                            <Dots />
                          </template>
                        </n-button>
                      </template>
                      <span> Sabab qo'shish</span>
                    </n-tooltip>
                  </n-input-group>
                </td>
                <td>
                  <n-input-group>
                    <n-select
                      @keydown="WhoKey($event, index)"
                      @search="WhoSearch"
                      v-model:value="item.who_id"
                      :options="UserOptions"
                      :render-label="renderUser"
                      :render-tag="renderUserSelect"
                      @update:value="employeeRole($event, index)"
                      value-field="id"
                      label-field="fullname"
                      :disabled="props.type == 'read'"
                      clearable
                      filterable
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
                    <n-tooltip placement="bottom" trigger="hover">
                      <template #trigger>
                        <n-button
                          type="success"
                          @click="AddWho(index)"
                          :style="{ padding: '0px 8px' }"
                        >
                          <template #icon>
                            <Dots />
                          </template>
                        </n-button>
                      </template>
                      <span> Shaxs qo'shish</span>
                    </n-tooltip>
                  </n-input-group>
                </td>
                <td>
                  <n-input-number
                    v-model:value="item.price"
                    @update:value="calcSumma"
                    :disabled="props.type == 'read'"
                    :format="format"
                    :parse="parse"
                    :min="0"
                    :step="10000"
                  ></n-input-number>
                </td>
                <td>
                  <n-input
                    type="text"
                    v-model:value="item.comment"
                    :disabled="props.type == 'read'"
                  ></n-input>
                </td>
                <td  v-if="props.type != 'read'">
                  <div
                    class="d-flex-btn"
                    style="
                      display: flex;
                      align-items: center;
                      justify-content: center;
                    "
                  >
                    <n-button @click="delBtn(item.id)" type="error">
                      <template #icon>
                        <n-icon size="20">
                          <delIcon />
                        </n-icon>
                      </template>
                    </n-button>
                  </div>
                </td>
              </tr>
            </tbody>
          </n-table>
          <div class="empty-show" v-if="form_data.rasxod_table.length == 0">
            <n-empty description="Xarajatlar  mavjud emas">
              <template #extra>
                <n-button @click="AddRasxod" type="success" size="small">
                  <template #icon>
                    <n-icon size="18">
                      <AddIcon />
                    </n-icon>
                  </template>
                  Qo'shish
                </n-button>
              </template>
            </n-empty>
          </div>
        </n-scrollbar>
      </div>
      <n-divider :style="{ margin: '12px 0px' }"></n-divider>
      <div class="btn-action" v-if="props.type != 'read'">
        <n-button @click="exit" type="warning">
          <template #icon>
            <exit-icon />
          </template>
          Chiqish
        </n-button>
        <n-button @click="save" type="success" >
          <template #icon>
            <n-icon>
              <save-icon />
            </n-icon>
          </template>
          Saqlash
        </n-button>
      </div>
    </n-form>
    <!-- branch index start -->
    <n-modal
      transform-orign="center"
      v-model:show="showBranch"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <BranchIndex
        @select="chooseBranch"
        :action="showBranchFrom"
        :item-value="branchName"
      >
      </BranchIndex>
    </n-modal>
    <!-- branch index end -->
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

    <!-- Becouse index start -->
    <n-modal
      transform-orign="center"
      v-model:show="showBecouse"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <BecouseIndex
        @select="chooseBecouse"
        :action="showBecouseForm"
        :item-value="BecouseName"
      >
      </BecouseIndex>
    </n-modal>
    <!-- Becouse index end -->
  </div>
</template>

<style scoped>
.empty-show {
  width: 100%;
  padding: 18px 0px;
}
.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>
