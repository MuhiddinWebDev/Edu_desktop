<script setup>
import { ref, onMounted, h } from "vue";
import { useMessage } from "naive-ui";
import ModelService from "../../../services/studentPay.service";
import BranchService from "../../../services/branch.service";
import GroupService from "../../../services/groups.service";
import DiscountService from "../../../services/discount.service";
import PayTypeService from "../../../services/payType.service";

import { Save24Filled as SaveIcon } from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";

import { TrashCan as delIcon, Pen as PenICon } from "@vicons/carbon";
import DiscountIndex from "../Discount/Index.vue";
import {
  useParsenumber,
  useFormatnumber,
} from "../../../composible/NumberFormat";

const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close", "no-action"]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const formRef = ref("");
const showFeedback = ref(false);
const spinBtn = ref(false);
const message = useMessage();
const showDiscount = ref(false);
////// select options

const coursesOptions = ref([]);
const branchOptions = ref([]);
const studentOptions = ref([]);
const discountOptions = ref([]);
const payTypeOptions = ref([]);
const groupsOptions = ref([]);

/////  select options

const form_data = ref({
  datetime: new Date().getTime(),
  doc_date: new Date().getTime(),
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
  student_id: null,
  group_id: null,
  course_id: null,
  course_price: 0,
  pay_sum: 0,
  discount_sum: 0,
  pay_type_id: 1,
  user_id: 1,
  comment: "",
  student_pay_table: [],
});

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};

const getAllDiscount = (filial) => {
  const search_data = {
    filial_id: findRole.value == "SuperAdmin" ? filial : findBranch.value,
  };
  DiscountService.searchModel(search_data).then((res) => {
    discountOptions.value = res;
  });
};

const studentOfCourse = (id) => {
  const params = {
    group_id: id,
    filial_id:
      findRole.value == "SuperAdmin"
        ? form_data.value.filial_id
        : findBranch.value,
  };
  GroupService.getCourseStudent(params).then((res) => {
    studentOptions.value = res.students;
    coursesOptions.value = res.course;
    form_data.value.course_id = res.course[0].id;
    form_data.value.course_price = res.course[0].price_month;
  });
};

const getAllPayType = () => {
  PayTypeService.getAll().then((res) => {
    payTypeOptions.value = res;
  });
};

const getAllGroups = (branch) => {
  const params = {
    filial_id: findRole.value == "SuperAdmin" ? branch : findBranch.value,
  };
  GroupService.searchModel(params).then((res) => {
    groupsOptions.value = res;
  });
};

const beginValues = () => {
  form_data.value.student_id = null;
  form_data.value.course_id = null;
  form_data.value.pay_sum = 0;
};

const UpdateBranch = (id) => {
  beginValues();
  getAllGroups(id);
  getAllDiscount(id);
};

const UpdateGroup = (id) => {
  beginValues();
  studentOfCourse(id);
};

const UpdateDiscount = (id) => {
  if (id) {
    const idx = discountOptions.value.findIndex((item) => item.id == id);
    const allowId = form_data.value.student_pay_table.findIndex(
      (item) => item.discount_id == id
    );
    let el = discountOptions.value[idx];
    let pr = (el.amount / 100) * form_data.value.pay_sum;
    if (allowId == -1) {
      form_data.value.student_pay_table.push({
        discount_id: el.id,
        discount_price: el.discount_type == "Summa" ? el.amount : pr,
        discount_type: el.discount_type,
        discount_action: el.discount_action,
        comment: "",
      });
      form_data.value.discount_sum = 0;
      form_data.value.student_pay_table.forEach((item) => {
        form_data.value.discount_sum += item.discount_price;
      });
    } else {
      message.warning("Bu chegirma qo'shilgan");
    }
  }
};

const rules = {
  student_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos talabani tanlang");
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
  group_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        showFeedback.value = true;
        return new Error("Iltimos guruh tanlang");
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
};

onMounted(() => {
  if (props.type == "update" || props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      form_data.value.datetime = res.datetime * 1000;
      getAllDiscount(res.filial_id);
      getAllGroups(res.filial_id);
      studentOfCourse(res.group_id);
    });
  }
  getAllBranches();
  getAllPayType();
  if(findRole.value != "SuperAdmin"){
    getAllGroups();
    getAllDiscount();
  }
});

const exit = () => {
  emit("close");
};
const save = async (allow) => {
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

const renderDiscountSelect = ({ option }) => {
  return h(
    "div",
    {
      style: {
        display: "flex",
        alignItems: "center",
      },
    },
    [option.name]
  );
};

const renderDiscount = (option) => {
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
          h("div", null, [option.name]),
          h("div", null, [
            option.discount_type == "Summa"
              ? "Summa: " +
                new Intl.NumberFormat("ru-RU", { style: "decimal" }).format(
                  option.amount
                )
              : "Foiz: " + option.amount + "%",
          ]),
        ]
      ),
    ]
  );
};
const checkValidation = (value, id) => {
  if (value == null) {
    return "error";
  } else {
    return "success";
  }
};

const delBtn = (index) => {
  form_data.value.discount_sum -=
    form_data.value.student_pay_table[index].discount_price;
  form_data.value.student_pay_table.splice(index, 1);
  if (form_data.value.student_pay_table.length == 0) {
    form_data.value.discount_sum = 0;
  }
};
</script>
<template>
  <div class="user-message">
    <n-form :model="form_data" ref="formRef" :rules="rules">
      <n-spin size="large" :show="spinBtn">
        <div class="pay-box">
          <n-grid cols="1 s:2 m:2 l:2" responsive="screen" :x-gap="12" :y-gap="4">
            <n-grid-item>
              <n-form-item label="To'lov sanasi">
                <n-date-picker
                  :disabled="true"
                  v-model:value="form_data.datetime"
                  :style="{ width: '100%' }"
                  type="datetime"
                ></n-date-picker>
              </n-form-item>
            </n-grid-item>
  
            <n-grid-item v-if="findRole == 'SuperAdmin'">
              <n-form-item label="Filial" path="filial_id">
                <n-select
                  @update:value="UpdateBranch"
                  :disabled="props.type == 'update' || props.type == 'read'"
                  :options="branchOptions"
                  label-field="name"
                  value-field="id"
                  v-model:value="form_data.filial_id"
                  filterable
                >
                </n-select>
              </n-form-item>
            </n-grid-item>
  
            <n-grid-item>
              <n-form-item label="Guruh" path="group_id">
                <n-select
                  :disabled="props.type == 'update' || props.type == 'read'"
                  :options="groupsOptions"
                  label-field="name"
                  value-field="id"
                  v-model:value="form_data.group_id"
                  @update:value="UpdateGroup"
                  filterable
                >
                </n-select>
              </n-form-item>
            </n-grid-item>
  
            <n-grid-item>
              <n-form-item label="Talaba" path="student_id">
                <n-select
                  :options="studentOptions"
                  label-field="fullname"
                  value-field="id"
                  v-model:value="form_data.student_id"
                  :disabled="props.type == 'update' || props.type == 'read'"
                  filterable
                >
                </n-select>
              </n-form-item>
            </n-grid-item>
  
            <n-grid-item>
              <n-form-item label="Kurs" path="course_id">
                <n-select
                  :disabled="true"
                  v-model:value="form_data.course_id"
                  :style="{ width: '100%' }"
                  :options="coursesOptions"
                  label-field="name"
                  value-field="id"
                  filterable
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="To'lov turi">
                <n-select
                  :style="{ width: '100%' }"
                  :options="payTypeOptions"
                  :disabled="props.type == 'read'"
                  label-field="name"
                  value-field="id"
                  v-model:value="form_data.pay_type_id"
                  filterable
                />
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Kurs narxi" path="course_price">
                <n-input-number
                  v-model:value="form_data.course_price"
                  :format="useFormatnumber"
                  :parse="useParsenumber"
                  :disabled="true"
                  :style="{ width: '100%' }"
                ></n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Summa" path="pay_sum">
                <n-input-number
                  v-model:value="form_data.pay_sum"
                  :format="useFormatnumber"
                  :parse="useParsenumber"
                  :min="0"
                  :disabled="props.type == 'read'"
                  :max="form_data.course_price - form_data.discount_sum"
                  :step="100000"
                  :style="{ width: '100%' }"
                ></n-input-number>
              </n-form-item>
            </n-grid-item>
  
            <n-grid-item>
              <n-form-item label="Chegirma summa" path="discount_sum">
                <n-input-number
                  :disabled="true"
                  v-model:value="form_data.discount_sum"
                  :format="useFormatnumber"
                  :parse="useParsenumber"
                  :style="{ width: '100%' }"
                ></n-input-number>
              </n-form-item>
            </n-grid-item>
            <n-grid-item>
              <n-form-item label="Izoh" path="comment">
                <n-input
                  v-model:value="form_data.comment"
                  :disabled="props.type == 'read'"
                  :style="{ width: '100%' }"
                ></n-input>
              </n-form-item>
            </n-grid-item>
          </n-grid>
          <n-divider :style="{ margin: '12px 0px' }"
            >Chegirmalar ro'yxati</n-divider
          >
          <div class="d-flex-row">
            <n-input-group>
              <n-input-group-label>Chegirma</n-input-group-label>
              <n-select
                @update:value="UpdateDiscount"
                :style="{ width: '100%' }"
                :options="discountOptions"
                :render-label="renderDiscount"
                :render-tag="renderDiscountSelect"
                :disabled="
                  (form_data.student_id && form_data.course_id ? false : true) || props.type =='read'
                "
                label-field="name"
                value-field="id"
                filterable
              />
            </n-input-group>
          </div>
          <div class="table-scroll">
            <n-table :bordered="false" :single-line="false">
              <thead class="table-scroll-top">
                <tr>
                  <th>№</th>
                  <th>Nomi</th>
                  <th>Summa</th>
                  <th>Xolati</th>
                  <th>Izoh</th>
                  <th>Amal</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="(item, index) in form_data.student_pay_table">
                  <td>{{ index + 1 }}</td>
                  <td>
                    <n-select
                      :disabled="true"
                      :style="{ width: '100%' }"
                      :options="discountOptions"
                      label-field="name"
                      value-field="id"
                      v-model:value="item.discount_id"
                      filterable
                    />
                  </td>
                  <td style="text-align: right">
                    {{
                      new Intl.NumberFormat("ru-RU", {
                        style: "decimal",
                      }).format(item.discount_price)
                    }}
                  </td>
                  <td>
                    {{
                      item.discount_action == "once" ? "Bir martalik" : "Doimiy"
                    }}
                  </td>
                  <td>
                    <n-input
                      v-model:value="item.comment"
                      :disabled="props.type == 'update' || props.type == 'read'"
                      :maxlength="256"
                      :status="checkValidation(item.comment)"
                      show-count
                      clearable
                    />
                  </td>
  
                  <td>
                    <n-button @click="delBtn(index)" type="error">
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
        </div>
        <div class="btn-action" v-if="props.type != 'read'">
          <n-button @click="exit" type="warning">
            <template #icon>
              <exit-icon />
            </template>
            Chiqish
          </n-button>
          <n-button @click="save('allow-btn')" type="success">
            <template #icon>
              <n-icon>
                <save-icon />
              </n-icon>
            </template>
            To'lash
          </n-button>
        </div>
      </n-spin>
    </n-form>
    <!-- Discount index start -->
    <n-modal
      transform-orign="center"
      v-model:show="showDiscount"
      preset="card"
      style="width: calc(100% - 35px)"
      size="small"
    >
      <div class="no-padding">
        <DiscountIndex></DiscountIndex>
      </div>
    </n-modal>
    <!-- Discount index end -->
  </div>
</template>

<style scoped>
.pay-box{
  height: calc(100vh - 140px);
  overflow: hidden;
  overflow-y: auto;
  padding-right: 6px;
}
.table-scroll {
  min-height: 150px;
  max-height: 650px;
  overflow: hidden;
  overflow: auto;
}
.table-scroll-top {
  position: sticky !important;
  top: 0 !important;
}
.btn-action {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  gap: 8px;
  padding-top:5px ;
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
