<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/discount.service";
import BranchService from "../../../services/branch.service";
// variables
const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update"]);

const findRole = ref(localStorage.getItem('role'));
const findBranch = ref(JSON.parse(localStorage.getItem('filial_id')));

const formRef = ref(null);
const spinBtn = ref(false);
const branchOption = ref([])


const form_data = ref({
  name: "",
  amount: 0,
  discount_type:"Summa",
  discount_action:"once",
  filial_id: findRole.value == 'SuperAdmin' ? null: findBranch.value,
});

const discountActionOptions = ref([
  {
    id:'once',
    name:'Bir martalik'
  },
  {
    id:'always',
    name:'Doimiylik'
  }
]);
const discountType = ref([
  {
    id: "Summa",
    name: "Summa",
  },
  {
    id: "Percentage",
    name: "Foiz",
  },
]);

const getAllBranches = ()=>{
  BranchService.getAll().then((res)=>{
    branchOption.value = res;
  })
}

const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Chegirma nomi  bo'sh ");
      }
    },
  },
  perecentage: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value < 0) {
        return new Error("Foizni kiriting ");
      }
    },
  },
};

const firsInput = ref(null);
onMounted(() => {
  getAllBranches()
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }
  firsInput.value?.focus();
});
const spinTime = () => {
  setTimeout(() => {
    spinBtn.value = false;
  }, 500);
};
const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      spinBtn.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
          spinTime();
        })
        .catch(() => {
          spinTime();
        });
    } else if (props.type == "update") {
      spinBtn.value = true;
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
          spinTime();
        })
        .catch(() => {
          spinTime();
        });
    }
  } catch (e) {}
};

//// key down event saved
const keySave = (e) => {
  if (e.key == "Enter") {
    save();
  }
};
//// branch index end
///// input format numbers
const format = (value) => {
    if (value === null)
        return "";
    return `${value.toLocaleString("ru-RU")}`;
}
const parse = (input) => {
    const nums = input.replace(/(,|\$|\s)/g, "").trim();
    if (/^\d+(\.(\d+)?)?$/.test(nums))
        return Number(nums);
    return nums === "" ? null : Number.NaN;
}
/////////////////////////
</script>
<template>
  <div class="111">
    <n-form
      :style="{ height: '100%' }"
      ref="formRef"
      :model="form_data"
      :rules="rules"
    >
      <n-spin :show="spinBtn">
        <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="12" :y-gap="2">
          <n-grid-item v-if="findRole == 'SuperAdmin'">
            <n-form-item label="Filial" path="filial_id">
              <n-select
                    :options="branchOption"
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.filial_id"
                    filterable
                  />
              </n-form-item>
          </n-grid-item>
          <n-grid-item>
            <n-form-item label="Nomi" path="name">
              <n-input
                ref="firsInput"
                @keydown="keySave"
                v-model:value="form_data.name"
                :maxlength="100"
                show-count
                clearable
              />
              </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Chegirma turi" path="discount_type">
              <n-select
              v-model:value="form_data.discount_type"
              :options="discountType"
              value-field="id"
              label-field="name"
              filterable
              clearable
              >
              </n-select>
              </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Chegirma xolati" path="discount_action">
                  <n-select
                    :options="discountActionOptions"
                    label-field="name"
                    value-field="id"
                    v-model:value="form_data.discount_action"
                    filterable
                  >
                  </n-select>
              </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item v-if="form_data.discount_type == 'Summa'" label="Summa" path="amount">
              <n-input-number
                v-model:value="form_data.amount"
                @keydown="keySave"
                :format="format"
                :parse="parse"
                :min="0"
                :step="10000"
                :style="{ width: '100%' }"
                show-count
                clearable
              />
              </n-form-item>
            <n-form-item v-else label="Foiz" path="amount">
              <n-input-number
                v-model:value="form_data.amount"
                @keydown="keySave"
                :format="format"
                :parse="parse"
                :max="100"
                :min="0"
                :step="10"
                :style="{ width: '100%' }"
                show-count
                clearable
              />
            </n-form-item>
          </n-grid-item>
        
        </n-grid>
        <div class="d-flex-end">
          <n-button @click="save"  type="success">Saqlash</n-button>
        </div>
      </n-spin>
    </n-form>
  </div>
</template>
<style>
.d-flex-end{
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 8px;
}
</style>