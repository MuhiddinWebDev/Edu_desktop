<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/softwarePayment.service";

// variables
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update"]);
const formRef = ref(null);
const spinBtn = ref(false);

const findRole = ref(localStorage.getItem("role"));
const findBranch = ref(JSON.parse(localStorage.getItem("filial_id")));

const form_data = ref({
  pay_date: null,
  next_date: null
});
const rules = {
  pay_date: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("To'lov vaqtni tanlang!");
      }
    },
  },
  next_date: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Keying to'lovni tanlang!");
      }
    },
  },
};

onMounted(() => {
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value.pay_date = res.pay_date * 1000;
      form_data.value.next_date = res.next_date * 1000;
    });
  }
  
});

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      spinBtn.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
        })
        .catch(() => {
          spinBtn.value = false;
        });
    } else if (props.type == "update") {
      spinBtn.value = true;
     
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
        })
        .catch(() => {
          spinBtn.value = false;
        });
    }
  } catch (e) {}
};


//// branch index end
</script>
<template>
  <div class="pay-box">
    <n-form
      :style="{ height: '100%' }"
      ref="formRef"
      :model="form_data"
      :rules="rules"
    >
      <n-spin :show="spinBtn">
       
        <n-form-item label="To'lov vaqti" path="name">
          <n-date-picker :style="{width:'100%'}" v-model:value="form_data.pay_date" type="datetime"  />
        </n-form-item>
        <n-form-item label="Keyingi to'lov" path="name">
          <n-date-picker :style="{width:'100%'}" v-model:value="form_data.next_date" type="datetime" />
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
