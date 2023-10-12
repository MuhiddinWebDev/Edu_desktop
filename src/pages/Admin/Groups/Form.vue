<script setup>
import { ref, onMounted, inject, h } from "vue";
import { NAvatar, NText } from "naive-ui";
import ModelService from "../../../services/groups.service";
import UserService from "../../../services/users.service";
import CourseService from "../../../services/course.service";
import BranchService from "../../../services/branch.service";
///// import indexs start
import CourseIndex from "../Courses/Index.vue";
import BranchIndex from "../Branch/Index.vue";
import UserIndex from "../Users/Index.vue";
import Dots from "../../../components/Dots/dots.vue";
///// import indexs start

import { useMessage } from "naive-ui";
import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { DeleteForeverRound as delIcon } from "@vicons/material";
import { Exit as ExitIcon } from "@vicons/ionicons5";
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);
const message = useMessage();
const course_image = inject("course_img");
const user_image = inject("img_url");
const CoursName = ref("");
const BranchName = ref("");
const UserName = ref("");

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const form_data = ref({
  name: "",
  course_id: null,
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  max_count: 5,
  count: null,
  group_table: [],
});
const formRef = ref("");
const showFeedback = ref(false);
const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        showFeedback.value = true;
        return new Error("Iltimos nomini kiritng");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos filialni tanlang!");
      }
    },
  },
  course_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos kursni tanlang!");
      }
    },
  },
  count: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == 0) {
        showFeedback.value = true;
        return new Error("Iltimos sonini  kiritng");
      }
    },
  },
  max_count: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == 0) {
        showFeedback.value = true;
        return new Error("Iltimos sonini  kiritng");
      }
    },
  },
};
const UserOptions = ref([]);
const CourseOptions = ref([]);
const BranchOptions = ref([]);

const getAllCourse = (branch) => {
  CourseOptions.value = [];
  const send_data = {
    filial_id: branch,
  };
  CourseService.searchModel(send_data).then((res) => {
    CourseOptions.value = res;
  });
};
const getAllBranch = () => {
  form_data.value.course_id = null;
  BranchService.getAll().then((res) => {
    BranchOptions.value = res;
  });
};
const getAllUser = (branch) => {
  UserOptions.value = [];
  const send_data = {
    filial_id: branch,
    role: "User",
    active: true,
  };
  UserService.getAll(send_data).then((res) => {
    res.forEach((item) => {
      UserOptions.value.push({
        user_id: item.id,
        fullname: item.fullname,
        image: item.image,
        branch: item.branch,
      });
    });
  });
};
const BranchUpdate = (branch_id) => {
  form_data.value.course_id = null;
  getAllCourse(branch_id);
  getAllUser(branch_id);
};
const firsInput = ref(null);
onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      res.group_table.forEach((item) => {
        if (item.user_id != null) {
          addUsers.value.push({
            user_id: item.user_id,
            fullname: item.users.fullname,
            image: "",
          });
        }
      });
      getAllUser(res.filial_id);
    });
  }
  if (props.type == "create") {
    form_data.value.name = props.defaultname;
  }
  if (findRole.value != "SuperAdmin") {
    form_data.value.filial_id = findBranch.value;
    BranchUpdate(findBranch.value);
  } else {
    getAllBranch();
    getAllCourse(form_data.value.filial_id);
  }
  firsInput.value?.focus();
});
const exit = () => {
  emit("close");
};
const spinBtn = ref(false);
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      form_data.value.group_table = addUsers.value;
      spinBtn.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          setTimeout(() => {
            spinBtn.value = false;
            emit("create", res);
          }, 500);
        })
        .catch((err) => {
          message.error("Nimadur xato");
          setTimeout(() => (spinBtn.value = false), 500);
        });
    } else if (props.type == "update") {
      spinBtn.value = true;
      form_data.value.group_table = addUsers.value;
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          setTimeout(() => {
            spinBtn.value = false;
            emit("update", res);
          }, 500);
        })
        .catch((err) => {
          message.error("Nimadur xato");
          setTimeout(() => (spinBtn.value = false), 500);
        });
    }
  } catch (e) {}
};
//// user list ;
const addUsers = ref([]);
const delBtn = (id) => {
  const index = addUsers.value.findIndex((item) => item.user_id == id);
  addUsers.value.splice(index, 1);
};
const chooseUser = (e) => {
  if (e != null) {
    const index = addUsers.value.findIndex((val) => val.user_id == e);
    if (index == -1 && form_data.value.max_count >= addUsers.value.length + 1) {
      form_data.value.count = addUsers.value.length + 1;
      UserOptions.value.forEach((element) => {
        if (element.user_id == e) {
          addUsers.value.push(element);
        }
      });
    }
    if (form_data.value.max_count == addUsers.value.length) {
      message.success("Guruh to'ldi");
    }
    if (index != -1) {
      message.warning("Bu talaba qo'shilgan");
    }
  }
};
/// user start
const showUser = ref(false);
const showUserForm = ref(null);
/// user end
//course start
const showCourse = ref(false);
const showCourseForm = ref(null);

//course end
// branch start
const showBranch = ref(false);
const showBranchForm = ref(null);
// branch end
///// select avatar
const renderCourseTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: course_image + option.image,
        round: true,
        size: 24,
        style: {
          marginRight: "12px",
        },
      }),
      option.name,
    ]
  );
};

const renderCourse = (option) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: course_image + option.image,
        round: true,
        size: "small",
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.name]), h(NText, { depth: 1, tag: "div" })],
        [
          h("div", null, [option.branch.name]),
          h(NText, { depth: 1, tag: "div" }),
        ]
      ),
    ]
  );
};

const renderUserTag = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [
      h(NAvatar, {
        src: user_image + option.image,
        round: true,
        size: 24,
        style: {
          marginRight: "12px",
        },
      }),
      option.fullname,
    ]
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
      h(NAvatar, {
        src: user_image + option.image,
        round: true,
        size: "small",
      }),
      h(
        "div",
        {
          style: {
            marginLeft: "8px",
            padding: "4px 0",
          },
        },
        [h("div", null, [option.fullname]), h(NText, { depth: 1, tag: "div" })],
        [
          h("div", null, [option.branch.name]),
          h(NText, { depth: 1, tag: "div" }),
        ]
      ),
    ]
  );
};
const chooseCourse = (data) => {
  form_data.value.course_id = data.id;
  showCourse.value = false;
  getAllCourse();
};
const chooseBranch = (data) => {
  form_data.value.filial_id = data;
  showBranch.value = false;
  getAllBranch();
};
const chooseUserByIndex = (data) => {
  chooseUser(data.id);
  showUser.value = false;
  getAllUser();
};

const CourseKey = (e) => {
  if (e.code == "F4") {
    showCourse.value = true;
    showCourseForm.value = 0;
  } else if (e.code == "Insert") {
    showCourse.value = true;
    showCourseForm.value = 1;
  }
};

const BranchKey = (e) => {
  if (e.code == "F4") {
    showBranch.value = true;
    showBranchForm.value = 0;
  } else if (e.code == "Insert") {
    showBranch.value = true;
    showBranchForm.value = 1;
  }
};

const UserKey = (e) => {
  if (e.code == "F4") {
    showUser.value = true;
    showUserForm.value = 0;
  } else if (e.code == "Insert") {
    showUser.value = true;
    showUserForm.value = 1;
  }
};

const addUsersByBtn = () => {
  showUser.value = true;
  showUserForm.value = 0;
};

const CourseSearch = (item) => {
  CoursName.value = item;
};

const BranchSearch = (branch) => {
  BranchName.value = branch;
};

const UserSearch = (user) => {
  UserName.value = user;
};

//// end
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <n-spin :show="spinBtn">
        <div class="user-message-header">
          <n-grid
            cols="1 s:1 m:3 l:3"
            :x-gap="12"
            :y-gap="2"
            responsive="screen"
          >
            <n-grid-item>
              <n-form-item label="Guruh nomi" path="name">
                <n-input
                  ref="firsInput"
                  v-model:value="form_data.name"
                  :maxlength="32"
                  show-count
                  clearable
                ></n-input>
              </n-form-item>
            </n-grid-item>
            <n-grid-item v-if="findRole == 'SuperAdmin'">
              <n-form-item label="Filial" path="filial_id">
                <n-input-group>
                  <n-select
                    @keydown="BranchKey"
                    @search="BranchSearch"
                    filterable
                    :options="BranchOptions"
                    @update:value="BranchUpdate"
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.filial_id"
                    clearable
                  >
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "insert"</p>
                    </template>
                    <template #action>
                      <p style="text-align: center">Qo'shish uchun "F4"</p>
                    </template>
                  </n-select>
                  <n-tooltip placement="right" trigger="hover">
                    <template #trigger>
                      <n-button
                        @click="showBranch = true"
                        type="success"
                        :style="{ padding: '0px 8px' }"
                      >
                        <template #icon>
                          <Dots />
                        </template>
                      </n-button>
                    </template>
                    <span>Filial qo'shish</span>
                  </n-tooltip>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Kurs" path="course_id">
                <n-input-group>
                  <n-select
                    @keydown="CourseKey"
                    @search="CourseSearch"
                    filterable
                    :options="CourseOptions"
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.course_id"
                    :render-label="renderCourse"
                    :render-tag="renderCourseTag"
                    clearable
                  >
                    <template #empty>
                      <p style="text-align: center">Qo'shish uchun "insert"</p>
                    </template>
                    <template #action>
                      <p style="text-align: center">Qo'shish uchun "F4"</p>
                    </template>
                  </n-select>
                  <n-tooltip placement="bottom" trigger="hover">
                    <template #trigger>
                      <n-button
                        type="success"
                        @click="showCourse = true"
                        :style="{ padding: '0px 8px' }"
                      >
                        <template #icon>
                          <Dots />
                        </template>
                      </n-button>
                    </template>
                    <span>Kurs qo'shish</span>
                  </n-tooltip>
                </n-input-group>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item
                :style="{ width: '100%' }"
                path="count"
                label="Talaba soni"
              >
                <n-input-number
                  :min="1"
                  :style="{ width: '100%' }"
                  :disabled="true"
                  v-model:value="form_data.count"
                  :show-button="false"
                ></n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item
                :style="{ width: '100%' }"
                label="Qabul soni"
                path="max_count"
              >
                <n-input-number
                  :min="1"
                  :style="{ width: '100%' }"
                  v-model:value="form_data.max_count"
                ></n-input-number>
              </n-form-item>
            </n-grid-item>
          </n-grid>
        </div>
        <n-divider :style="{ margin: '8px 0px' }">Talaba qo'shish</n-divider>
        <div class="add-user_item">
          <n-form-item label="Talabalar">
            <n-input-group>
              <n-select
                @keydown="UserKey"
                @update:value="chooseUser"
                @search="UserSearch"
                placement="top-start"
                :options="UserOptions"
                filterable
                value-field="user_id"
                label-field="fullname"
                :render-label="renderUser"
                :render-tag="renderUserTag"
              >
                <template #empty>
                  <p style="text-align: center">Qo'shish uchun "insert"</p>
                </template>
                <template #action>
                  <p style="text-align: center">Qo'shish uchun "F4"</p>
                </template>
              </n-select>
              <n-tooltip placement="right" trigger="hover">
                <template #trigger>
                  <n-button
                    @click="addUsersByBtn"
                    type="success"
                    :style="{ padding: '0px 8px' }"
                  >
                    <template #icon>
                      <Dots />
                    </template>
                  </n-button>
                </template>
                <span>Talabalar qo'shish</span>
              </n-tooltip>
            </n-input-group>
          </n-form-item>
        </div>
        <n-space vertical>
          <n-scrollbar style="max-height: 320px; padding-right: 8px">
            <n-table
              :style="{ margin: '8px 0px 0px 0px' }"
              :bordered="false"
              :single-line="false"
              size="small"
            >
              <thead>
                <tr>
                  <th>№</th>
                  <th>Rasm</th>
                  <th>Ismi</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in addUsers" :key="index">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <n-image
                      v-if="item.image != ''"
                      :width="100"
                      :src="user_image + item.image"
                    ></n-image>
                    <p v-else>Rasm yo'q</p>
                  </td>
                  <td>{{ item.fullname }}</td>
                  <td style="width: 35px">
                    <div
                      class="d-flex-btn"
                      style="
                        display: flex;
                        align-items: center;
                        justify-content: center;
                      "
                    >
                      <n-button @click="delBtn(item.user_id)" type="error">
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
          </n-scrollbar>
        </n-space>
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
    <!--course start-->
    <n-modal
      transform-orign="center"
      v-model:show="showCourse"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <div class="no-padding">
        <CourseIndex
          @select="chooseCourse"
          :action="showCourseForm"
          :itemValue="CoursName"
        ></CourseIndex>
      </div>
    </n-modal>
    <!--course end-->
    <!-- branch start -->
    <n-modal
      transform-orign="center"
      v-model:show="showBranch"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <div class="no-padding">
        <BranchIndex
          @select="chooseBranch"
          :action="showBranchForm"
          :itemValue="BranchName"
        ></BranchIndex>
      </div>
    </n-modal>
    <!-- branch end -->
    <!-- user start -->
    <n-modal
      transform-orign="center"
      v-model:show="showUser"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <div class="no-padding">
        <UserIndex
          @select="chooseUserByIndex"
          :action="showUserForm"
          :itemValue="UserName"
        ></UserIndex>
      </div>
    </n-modal>
    <!-- user end -->
  </div>
</template>

<style scoped>
.add-user {
  max-height: 320px;
  overflow: hidden;
  overflow: auto;
  padding-right: 12px;
  display: grid;
  gap: 8px;
  margin: 5px 0px;
  grid-template-columns: 1fr;
}

.add-user_btns {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 7px;
}

.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}


</style>
