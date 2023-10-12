<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/branch.service";
import RegionService from "../../../services/region.service";
import {
  Location16Filled as locatioIcon,
  Add16Filled as addicon,
  Save24Filled as SaveIcon
} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5";

// variables
const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);
const formRef = ref(null);
const regionOptions = ref([]);
const districtOptions = ref([]);
const branchOptions = ref([]);
const spinner = ref(false);

const form_data = ref({
  name: "",
  phone: "",
  region_id: null,
  district_id: null,
  parent_id: null,
  folder:false,
  comment: "",
});

const AllRegion = () => {
  RegionService.getAllRegion().then((res) => {
    regionOptions.value = res;
  });
};

const AllDistrict = (region) => {
  let chooseData = {
    region_id: region,
  };
  RegionService.getAllDistrict(chooseData).then((res) => {
    districtOptions.value = res;
  });
};

const getAllBranches = ()=>{
  ModelService.getAll().then((res) => {
    branchOptions.value = res;
  })
}
const UpdateRegion = (id) => {
  form_data.value.district_id = null;
  AllDistrict(id);
};

const rules = {
  name: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Filia nomi  bo'sh ");
      }
    },
  },
};
onMounted(() => {
  AllRegion();
  getAllBranches()
  if (props.type == "update") {
    ModelService.getOne(props.id).then((res) => {
      form_data.value = res;
      AllDistrict(res.region_id)
    });
  } else if (props.type == "create") {
    form_data.value.name = props.defaultname;
  }
});

const onlyAllowNumber = (phone) => !phone || /^\d+$/.test(phone);
//// phone format

const save = async () => {
  try {
    const result = await formRef.value?.validate();
    if (props.type == "create") {
      spinner.value = true;
      ModelService.create(form_data.value)
        .then((res) => {
          emit("create", res);
          spinner.value = false;
        })
        .catch(() => {
          spinner.value = false;
        });
    } else if (props.type == "update") {
      spinner.value = true;
      ModelService.update(props.id, form_data.value)
        .then((res) => {
          emit("update", res);
          spinner.value = false;
        })
        .catch(() => {
          spinner.value = false;
        });
    }
  } catch (e) {}
};

const exitBtn =  () =>{
    emit("close")
}

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
      <n-spin :show="spinner">
        <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="15" :y-gap="2">
          <n-grid-item>
            <n-form-item label="Filial nomi" path="name">
              <n-input
                @keydown="keySave"
                v-model:value="form_data.name"
                :maxlength="32"
                show-count
                clearable
              />
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Telefon raqam" path="phone">
              <n-input-group>
                <n-input-group-label>
                  <n-icon>
                    <addicon />
                  </n-icon>
                </n-input-group-label>
                <n-input
                  :allow-input="onlyAllowNumber"
                  @keydown="keySave"
                  v-model:value="form_data.phone"
                  :maxlength="16"
                  show-count
                  clearable
                />
              </n-input-group>
            </n-form-item>
          </n-grid-item>
          
          <n-grid-item>
            <n-form-item label="Filialga biriktirish" path="parent_id">
              <n-select
                v-model:value="form_data.parent_id"
                clearable
                filterable
                :options="branchOptions"
                label-field="name"
                value-field="id"
                :disabled="props.id == 1"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>

          <n-grid-item>
            <n-form-item label="Viloyat" path="region_id">
              <n-select
                @update:value="UpdateRegion"
                v-model:value="form_data.region_id"
                clearable
                filterable
                :options="regionOptions"
                label-field="name"
                value-field="id"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          
          <n-grid-item>
            <n-form-item label="Shahar" path="district_id">
              <n-select
                v-model:value="form_data.district_id"
                clearable
                filterable
                :options="districtOptions"
                label-field="name"
                value-field="id"
              >
              </n-select>
            </n-form-item>
          </n-grid-item>
          
          <n-grid-item>
            <n-form-item label="Bosh filial" path="folder">
              <n-checkbox 
                v-model:checked="form_data.folder" 
                size="large" 
                label="Bergilash" />
            </n-form-item>
          </n-grid-item>
        </n-grid>
        <n-form-item label="Qo'shimcha" path="comment">
          <n-input
            type="textarea"
            @keydown="keySave"
            v-model:value="form_data.comment"
            :maxlength="256"
            show-count
            clearable
          />
        </n-form-item>

        <div class="table-footer">
            <div class="table-footer_item">
              <n-spin :show="spinner">
                <n-button 
                @click="exitBtn" 
                style="min-width: 120px" 
                type="warning">
                <template #icon>
                    <n-icon>
                    <ExitIcon />
                    </n-icon>
              </template>
                Chiqish
                </n-button
                >
              </n-spin>
            </div>
            <div class="table-footer_item">
              <n-spin :show="spinner">
                <n-button 
                @click="save" 
                style="min-width: 120px" 
                type="success">
                <template #icon>
                    <n-icon>
                    <SaveIcon />
                    </n-icon>
                </template>
                Saqlash
                </n-button
                >
              </n-spin>
            </div>
          </div>
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
