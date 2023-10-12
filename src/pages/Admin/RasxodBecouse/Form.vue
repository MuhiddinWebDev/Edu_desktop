<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/rasxodBecouse.service";
import BranchService from "../../../services/branch.service";
// variables
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const branchOption = ref([]);
const spinBtn = ref(false);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));


const form_data = ref({
  name: "",
  filial_id: findRole.value == 'SuperAdmin' ? null: findBranch.value,
});
const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Sababni nomi  bo'sh ");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Filial majburiy ");
      }
    },
  },
};
const inputFocus = ref(null);

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};

onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  } else if (props.type == "create") {
    form_data.value.name = props.defaultname;
  }
  getAllBranches();
});

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      spinBtn.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
          spinBtn.value = false;
        })
        .catch(() => {
          spinBtn.value = false;
        });
    } else if (props.type == "update") {
      spinBtn.value = true;
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
          spinBtn.value = false;
        })
        .catch(() => {
          spinBtn.value = false;
        });
    }
  } catch (e) {}
};
const keySave = (e) => {
  if (e.key == "Enter") {
    save();
  }
};
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
        <n-form-item label="Filial" path="filial_id" v-if="findRole == 'SuperAdmin'">
          <n-select
            @keydown="keySave"
            v-model:value="form_data.filial_id"
            :options="branchOption"
            label-field="name"
            value-field="id"
            placeholder="Qidiruv"
            filterable
            clearable
          >
          </n-select>
        </n-form-item>
        <n-form-item label="Sababni nomi" path="name">
          <n-input
            @keydown="keySave"
            v-model:value="form_data.name"
            :maxlength="32"
            show-count
            clearable
          />
        </n-form-item>
        <n-button @click="save" block type="success">Saqlash</n-button>
      </n-spin>
    </n-form>
  </div>
</template>

<style scoped>
.auto-height {
  height: 100%;
}

.modal-parent {
  height: 100%;
}

.modal-box-footer {
  display: flex;
  align-items: center;
  justify-content: flex-end;
}

.modal-box {
  height: 100%;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.modal-box-footer_item {
  width: 33%;
  margin-top: 12px;
}
</style>
