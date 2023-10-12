<script setup>
import { ref, onMounted } from "vue";
import { useNotification } from "naive-ui";
import ModelService from "../../../services/teacherSalary.service";
import SalaryService from "../../../services/salary.service";
import LessonService from "../../../services/lesson.service";
import UserService from "../../../services/users.service";
import BranchService from "../../../services/branch.service";
import PayTypeService from "../../../services/payType.service";
import CourseService from "../../../services/course.service";
import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";

import {
  useParsenumber,
  useFormatnumber,
} from "../../../composible/NumberFormat";
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref("");
const showFeedback = ref(false);
const spinBtn = ref(false);
const notification = useNotification();
////// select options
const courseOptions = ref([]);
const teacherOptions = ref([]);
const branchOptions = ref([]);
const payTypeOptions = ref([]);
const teacherName = ref("");

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));
/////  select options

const form_data = ref({
  datetime: new Date().getTime(),
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  teacher_id: null,
  salary_id: null,
  pay_type_id: 1,
  student_count: 0,
  status: "wait",
  all_sum: 0,
  pay_summa: 0,
  course_id: null,
  course_price: 0,
  summa: 0,
  comment: "",
  user_id: parseInt(localStorage.getItem("id")),
  teacher_groups: [],
});
//// choose teacher =>
const cleanData = () => {
  form_data.value.salary_id = null;
  form_data.value.course_id = null;
  form_data.value.course_price = 0;
  form_data.value.student_count = 0;
  form_data.value.all_sum = 0;
  form_data.value.pay_summa = 0;
  form_data.value.summa = 0;
  form_data.value.teacher_groups = [];
};
const salaryAction = ref({
  oylik: null,
  foizlik: null,
});

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};
const getAllPayTypes = () => {
  PayTypeService.getAll().then((res) => {
    payTypeOptions.value = res;
  });
};
const getAllCourses = (branch, teacher) => {
  let sendData = {
    filial_id: findRole.value == "SuperAdmin" ? branch : findBranch.value,
    teacher_id: teacher,
  };
  CourseService.searchModel(sendData).then((res) => {
    courseOptions.value = res;
  });
};
const allowPay = ref(false);
const getAllGroups = (id) => {
  let sendData = {
    filial_id:
      findRole.value == "SuperAdmin"
        ? form_data.value.filial_id
        : findBranch.value,
    teacher_id: form_data.value.teacher_id,
    course_id: id,
  };
  LessonService.searchTeacher(sendData).then((res) => {
    if (res.length > 0 && props.type == "create") {
      form_data.value.teacher_groups = res;
      form_data.value.teacher_groups.forEach((item) => {
        form_data.value.student_count += item.student_count;
      });
      form_data.value.course_price = res[0].course_price_month;
      form_data.value.course_id = res[0].course_id;
      const teacherData = {
        user_id: form_data.value.teacher_id,
      };
      SalaryService.getSalary(teacherData).then((res) => {
        if (res) {
          form_data.value.salary_id = res.id;
          if (res.price_type == "Monthly") {
            form_data.value.all_sum = res.salary;
          } else if (res.price_type == "Percentage") {
            form_data.value.all_sum =
              form_data.value.student_count *
              form_data.value.course_price *
              (res.salary / 100);
          }
          allowPay.value = true;
        }
      });
    } else if (res.length == 0) {
      if(props.type !='update'){
        allowPay.value = false;
        notification.warning({
          content: "Ogohlantirish",
          meta: "To'lov qilish mumkin emas. Bu kurs bo'yicha darslar boshlanmagan.",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
    }
  });
};

const teacherUpdate = (id) => {
  cleanData();
  if (id != null) {
    getAllCourses(findRole.value == "SuperAdmin"? form_data.value.filial_id: findBranch.value, id);
    const teacherData = {
      user_id: id,
    };
    SalaryService.getSalary(teacherData).then((res) => {
      if(!res) {
        allowPay.value = false;
        notification.warning({
          content: "Ogohlantirish",
          meta: "Iltimos o'qituvchiga ish haqqi shakillantiring",
          duration: 2500,
          keepAliveOnHover: true,
        });
      }
    });
  }
};

const CourseUpdate = (id) => {
  cleanData();
  if (id != null) {
    getAllGroups(id);
  }
};

const getAllTeachers = (filial) => {
  const searchData = {
    filial_id: findRole.value == "SuperAdmin" ? filial : findBranch.value,
    role: "Teacher",
  };
  UserService.getAll(searchData).then((res) => {
    teacherOptions.value = res;
  });
};

const BranchUpdate = (id) => {
  cleanData();
  form_data.value.teacher_id = null;
  getAllTeachers(id);
};

const rules = {
  group_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos guruhni tanlang");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos filialni tanlang");
      }
    },
  },
  course_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos kursni tanlang");
      }
    },
  },
  teacher_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos o'qituvchini tanlang");
      }
    },
  },
};

onMounted(() => {
  if (props.type == "update" || props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      form_data.value.datetime = res.datetime * 1000;
      getAllGroups(res.teacher_id);
      getAllTeachers(res.filial_id);
      getAllCourses(res.filial_id, res.teacher_id);
      allowPay.value = true;
    });
  }
  getAllBranches();
  getAllPayTypes();
  getAllTeachers();
});

const exit = () => {
  emit("close");
};

const statusController = () => {
  if (form_data.value.all_sum <= form_data.value.pay_summa) {
    form_data.value.status = "done";
  } else {
    form_data.value.status = "wait";
  }
};
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "update") {
      statusController();
      ModelService.update(props.id, form_data.value).then((res) => {
        emit("update", res);
      });
    } else if (props.type == "create" && allowPay.value == true) {
      statusController();
      ModelService.create(form_data.value).then((res) => {
        emit("create", res);
      });
    }
  } catch (e) {}
};
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <n-spin size="large" :show="spinBtn">
        <n-grid cols="1 s:2 m:3 l:3" responsive="screen" :x-gap="12" :y-gap="4">
          <n-grid-item>
            <n-form-item label="Sana" path="datetime">
              <n-date-picker
                :style="{ width: '100%' }"
                type="datetime"
                v-model:value="form_data.datetime"
                :disabled="true"
              ></n-date-picker>
            </n-form-item>
          </n-grid-item>
          <n-grid-item v-if="findRole == 'SuperAdmin'">
            <n-form-item label="Filial" path="filial_id">
              <n-select
                :options="branchOptions"
                @update:value="BranchUpdate"
                :disabled="props.type == 'update' || props.type == 'read'"
                label-field="name"
                value-field="id"
                v-model:value="form_data.filial_id"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="O'qituvchi" path="teacher_id">
              <n-select
                :options="teacherOptions"
                @update:value="teacherUpdate"
                :disabled="props.type == 'update' || props.type == 'read'"
                label-field="fullname"
                value-field="id"
                v-model:value="form_data.teacher_id"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Kurs" path="course_id">
              <n-select
                :options="courseOptions"
                label-field="name"
                value-field="id"
                @update:value="CourseUpdate"
                :disabled="props.type == 'update' || props.type == 'read'"
                v-model:value="form_data.course_id"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Talaba soni" path="student_count">
              <n-input-number
                :disabled="true"
                v-model:value="form_data.student_count"
                :show-button="false"
                :style="{ width: '100%' }"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Oylik" path="all_sum">
              <n-input-number
                :disabled="true"
                :format="useFormatnumber"
                :parse="useParsenumber"
                :show-button="false"
                :style="{ width: '100%' }"
                v-model:value="form_data.all_sum"
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Kurs narxi" path="course_price">
              <n-input-number
                :disabled="true"
                :format="useFormatnumber"
                :parse="useParsenumber"
                :show-button="false"
                :style="{ width: '100%' }"
                v-model:value="form_data.course_price"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="To'lov turi" path="pay_type_id">
              <n-select
                :options="payTypeOptions"
                v-model:value="form_data.pay_type_id"
                label-field="name"
                :disabled="props.type == 'read'"
                value-field="id"
                filterable
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="To'lov summa" path="summa">
              <n-input-number
                :format="useFormatnumber"
                :parse="useParsenumber"
                :style="{ width: '100%' }"
                :min="0"
                :max="form_data.all_sum"
                :step="form_data.all_sum"
                :disabled="props.type == 'read'"
                v-model:value="form_data.pay_summa"
              />
            </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Izoh" path="comment">
              <n-input
                type="text"
                v-model:value="form_data.comment"
                :disabled="props.type == 'read'"
              />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-scrollbar x-scrollable>
          <n-table   size="small" :bordered="true" :single-line="false">
            <thead>
              <tr>
                <th style="width: 40px">№</th>
                <th>Guruh</th>
                <th>Talaba soni</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="(item, index) in form_data.teacher_groups">
                <td style="width: 40px">{{ index + 1 }}</td>
                <td>
                  {{ props.type == "create" ? item.group_name : item.group.name }}
                </td>
                <td>{{ item.student_count }}</td>
              </tr>
            </tbody>
          </n-table>
        </n-scrollbar>
        <div class="btn-action" v-if="props.type != 'read'">
          <n-button @click="exit" type="warning">
            <template #icon>
              <exit-icon />
            </template>
            Chiqish
          </n-button>
          <n-button @click="save" type="success" :disabled="!allowPay">
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
  </div>
</template>

<style scoped>
.user-message{
  overflow: hidden;
  overflow-y: auto;
  padding-right: 6px;
}
.d-flex-btn {
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding-top: 5px;
  position: sticky;
  bottom: 0;
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
