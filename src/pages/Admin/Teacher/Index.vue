<script setup>
import { h, ref, onMounted, inject, watch, reactive } from "vue";
import ModelService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import { useMagicKeys } from "@vueuse/core";
import {
  NButton,
  NIcon,
  useMessage,
  useDialog,
  NImage,
  NSwitch,
  useNotification,
} from "naive-ui";
import ModelForm from "./Form.vue";
import ModelFormMore from "./MoreForm.vue";
import {
  Add20Filled as AddIcon,
  AddSquareMultiple16Filled as AddMoreIcon,
} from "@vicons/fluent";
import { Pen as PenICon } from "@vicons/carbon";

const message = useMessage();
const dialog = useDialog();
const notification = useNotification();
const showCreate = ref(false);
const showCreateMore = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const img_url = inject("img_url");
const loadingRef = ref(true);
const emits = defineEmits(["select"]);
const props = defineProps(["action", "itemValue"]);
const UserOptions = ref([]);
const BranchOptions = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const sendData = ref({
  id: null,
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  role: "Teacher",
});
const getUserOptions = (resData) => {
  ModelService.getAll(resData).then((res) => {
    UserOptions.value = res;
  });
};
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    BranchOptions.value = res;
  });
};
const getAll = (goData) => {
  loadingRef.value = true;
  ModelService.getAll(goData).then((res) => {
    loadingRef.value = false;
    data.value = res;
    if (props.action == 4 || props.action == 5) {
      UserOptions.value = [];
      UserOptions.value = res;
    }
  });
};

const getAllSort = (role) => {
  sendData.value.role = role;
  getAll(sendData.value);
};

const formatUzbekPhoneNumber = (phoneNumber) => {
  const cleaned = phoneNumber.replace(/\D/g, "");
  const match = cleaned.match(/^998(\d{2})(\d{3})(\d{4})$/);

  if (match) {
    return `+998 ${match[1]}  ${match[2]}  ${match[3].slice(0,2)} ${match[3].slice(2, 4)}`;
  }
  return phoneNumber;
};

const data = ref([]);
const activeData = ref({
  active: null,
  user_id: null,
});
const activeLoading = ref(false);
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
    title: "Telefon",
    key: "phone",
    resizable: true,
    render(row) {
      const formatPhone = row.phone;
      return  formatUzbekPhoneNumber(formatPhone);
    },
  },
  {
    title: "Filial",
    key: "branch.name",
    resizable: true,
    sortOrder: true,
    sorter: (row1, row2) => row1.branch.id - row2.branch.id,
  },
  {
    title: "Tili",
    key: "lang",
    resizable: true,
    sortOrder: true,
    sorter: "default",
  },
  {
    title: "Rasm",
    key: "image",
    resizable: true,
    render(row) {
      if (row.image != "") {
        return h(NImage, {
          height: 50,
          lazy: true,
          src: `${img_url}/${row.image}`,
        });
      } else {
        return "Rasm yo'q";
      }
    },
  },
  {
    title: "Faol",
    key: "active",
    width: 80,
    sortOrder: true,
    sorter: (row1, row2) => row1.active - row2.active,
    render(row) {
      return [
        h(NSwitch, {
          value: row.active,
          loading: activeLoading.value,
          disabled: row.role == "SuperAdmin" ? true : false,
          round: true,
          onUpdateValue: ($event) => {
            dialog.warning({
              title: "Ogohlantirish",
              content: `Faollikni o'zgartirmoqchimisiz`,
              positiveText: "Xa",
              negativeText: "Yo'q",
              onPositiveClick: () => {
                activeData.value.user_id = row.id;
                activeData.value.active = $event;
                activeLoading.value = true;
                ModelService.activeUser(activeData.value)
                  .then((res) => {
                    row.active = res.active;
                    activeLoading.value = false;
                    notification["success"]({
                      content: "Muvaffaqiyatli bajarildi",
                      meta: res.active
                        ? "O'qituvchi foalashtirildi"
                        : "O'qituvchi foalsizlantirildi",
                      duration: 2500,
                      keepAliveOnHover: true,
                    });
                  })
                  .catch((err) => {
                    loadingRef.value = false;
                    message.error("Jarayon bajarilmadi");
                  });
              },
              onNegativeClick: () => {
                message.success("Bekor qilindi!");
              },
            });
          },
        }),
      ];
    },
  },
  {
    title: "Yangilash",
    key: "action",
    width: 80,
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
const defaultObeject = ref({
  actionId: null,
  name: null,
});

onMounted(() => {
  if (props.action == 1) {
    showCreate.value = true;
    getAllSort("Teacher");
    defaultObeject.value.name = props.itemValue;
    defaultObeject.value.actionId = props.action;
  } else if (props.action == 0) {
    getAllSort("Teacher");
  } else if (props.action == 2) {
    getAllSort("Teacher");
  } else if (props.action == 3) {
    showCreate.value = true;
    getAllSort("Teacher");
    defaultObeject.value.name = props.itemValue;
    defaultObeject.value.actionId = props.action;
  } else {
    getAll(sendData.value);
  }
  getUserOptions(sendData.value);
  getAllBranches();
});
/////  create and update functions

const createModel = (res) => {
  showCreate.value = false;
  getAllSort("Teacher");
  ///////
};

//// create more functions start

const createMoreModel = () => {
  showCreateMore.value = false;
  getAll(sendData.value);
};

//// create more functions end
const modalClose = (e) => {
  if (e == "create") {
    showCreate.value = false;
  } else if (e == "update") {
    showUpdate.value = false;
  } else if (e == "more-create") {
    showCreateMore.value = false;
  }
};

const updateModel = (res) => {
  showUpdate.value = false;
  message.success("Ma'lumot yangilandi");
  getAllSort("Teacher");
};
//////////////////////////////// sort show information about
const sortOption = ref([
  {
    role: "Admin",
    label: "Admin",
  },
  {
    role: "Teacher",
    label: "O'qituvchi",
  },
  {
    role: "User",
    label: "Talabalar",
  },
]);

const selectBranch = (id) => {
  if (findRole.value == "SuperAdmin") {
    sendData.value.filial_id = id;
    sendData.value.id = null;
    getAll(sendData.value);
    getUserOptions(sendData.value);
  }
};
const showOneUser = (e) => {
  sendData.value.id = e;
  getAll(sendData.value);
};

////////////////////////////////////////////////////////////////
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      emits("select", row);
    },
  };
};

//// window key event start
const { insert, NumpadAdd /* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v) showCreate.value = true;
  else showCreateMore.value = false;
});

watch(NumpadAdd, (v) => {
  if (v) showCreateMore.value = true;
  else showCreate.value = false;
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
        [
          h("div", null, [option.fullname]),
          h("div", null, [formatUzbekPhoneNumber(option.phone)]),
          h("div", null, ["Filial: " + option.branch.name]),
        ]
      ),
    ]
  );
};

//// render select function end
const rowClassName = (row) => {
  if (!row.active) {
    return "too-old";
  }
  return "";
};

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
          <h2>O'qituvchilar</h2>
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
          <n-button @click="showCreateMore = true" type="success">
            <template #icon>
              <n-icon size="18">
                <AddMoreIcon />
              </n-icon>
            </template>
            Ko'proq qo'shish
            <span class="Insert-key">
              <n-icon size="14"> <AddIcon /> </n-icon
            ></span>
          </n-button>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group >
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              @update:value="selectBranch"
              :options="BranchOptions"
              value-field="id"
              v-model:value="sendData.filial_id"
              label-field="name"
  
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>F.I.O</n-input-group-label>
            <n-select
              @update:value="showOneUser"
              :options="UserOptions"
              v-model:value="sendData.id"
              :render-label="renderUser"
              :render-tag="renderUserSelect"
              value-field="id"
              label-field="fullname"
  
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loadingRef"
        :columns="columns"
        :data="data"
        :pagination="pagination"
        :bordered="true"
        :single-line="false"
        style="min-width: 1000px"
        max-height="calc(100vh - 300px)"
        :row-props="rowProps"
        :row-class-name="rowClassName"
        size="small"
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
        style="max-width: 700px; width: calc(100vw - 15px)"
        title="O'qituvchi qo'shish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="modalClose('create')"
      >
        <ModelForm
          @close="modalClose('create')"
          @create="createModel"
          :defaultObeject="defaultObeject"
          type="create"
        />
      </n-card>
    </n-modal>
    <n-modal
      transform-orign="center"
      v-model:show="showUpdate"
      :mask-closable="false"
    >
      <n-card
        style="max-width: 700px; width: calc(100vw - 15px)"
        title="O'qituvchini o'zgartirish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="modalClose('update')"
      >
        <ModelForm
          @close="modalClose('update')"
          type="update"
          :id="updateId"
          @update="updateModel"
        />
      </n-card>
    </n-modal>
    <n-drawer
      v-model:show="showCreateMore"
      width="100vw"
      height="calc(100vh - 120px)"
      placement="top"
    >
      <n-drawer-content title="O'qituvchilar qo'shish" closable>
        <ModelFormMore
          @close="modalClose('more-create')"
          @create="createMoreModel"
          type="create"
        />
      </n-drawer-content>
    </n-drawer>
    <!-- create more end -->
  </section>
</template>

<style scoped>
:deep(.too-old td) {
  /* color: rgba(255, 0, 0, 0.75) !important; */
  background-color: #f1990b8e;
}

.btn-action {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 7px;
  margin-bottom: 12px;
}
</style>
