<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/room.service";
import BranchService from "../../../services/branch.service";
import BranchIndex from "../Branch/Index.vue";
import Dots from "../../../components/Dots/dots.vue";
// variables
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update"]);
const formRef = ref(null);
const spinBtn = ref(false);
const branchs = ref([]);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const form_data = ref({
  name: "",
  filial_id: findRole.value == "SuperAdmin" ? null : findBranch.value,
});
const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Xona nomi  bo'sh ");
      }
    },
  },
  filial_id: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Filial nomi  tanlang ");
      }
    },
  },
};

const getAllBranch = () => {
  BranchService.getAll(props.id).then((res) => {
    branchs.value = res;
  });
};
const firsInput = ref(null);
onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
    });
  }
  if (props.type == "create") {
    form_data.value.name = props.defaultname;
  }
  firsInput.value?.focus();
  getAllBranch();
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

//// branch index start
const BranchName = ref("");
const showBranch = ref(false);
const showBranchForm = ref(null);
const showBranchBtn = () => {
  showBranch.value = true;
  showBranchForm.value = 0;
};
const SearchBranch = (branch) => {
  BranchName.value = branch;
};
const chooseBranch = (data) => {
  form_data.value.filial_id = data;
  showBranch.value = false;
  showBranchForm.value = 0;
  getAllBranch();
};
const keySave = (e) => {
  if (e.key == "Enter") {
    save();
  } else if (e.code == "F4") {
    showBranch.value = true;
    showBranchForm.value = 0;
  } else if (e.code == "Insert") {
    showBranch.value = true;
    showBranchForm.value = 1;
  }
};
//// branch index end
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
        <n-form-item
          label="Filial"
          path="filial_id"
          v-if="findRole == 'SuperAdmin'"
        >
          <n-input-group>
            <n-select
              @keydown="keySave"
              @search="SearchBranch"
              :options="branchs"
              v-model:value="form_data.filial_id"
              label-field="name"
              value-field="id"
              filterable
              clearable
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
                  @click="showBranchBtn"
                  type="success"
                  :style="{ padding: '0px 8px' }"
                >
                  <template #icon>
                    <dots />
                  </template>
                </n-button>
              </template>
              <span> Filial qo'shish </span>
            </n-tooltip>
          </n-input-group>
        </n-form-item>
        <n-form-item label="Xona nomi" path="name">
          <n-input
            ref="firsInput"
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
  <!-- select adds start-->
  <n-modal
    v-model:show="showBranch"
    preset="card"
    style="max-width: calc(100% - 35px)"
    transform-orign="center"
  >
    <div class="no-padding">
      <branch-index
        @select="chooseBranch"
        :action="showBranchForm"
        :itemValue="BranchName"
      ></branch-index>
    </div>
  </n-modal>
  <!-- select adds end -->
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
