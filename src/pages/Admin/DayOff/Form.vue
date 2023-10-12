<script setup>
import { ref, onMounted, inject} from 'vue'
import ModelService from '../../../services/dayOff.service';
import BranchService from "../../../services/branch.service";
// variables 
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update'])
const formRef = ref(null);
const spinBtn = ref(false);
const dayJS = inject('dayJS');
const today = ref( new Date().getTime());
const branchesOptions = ref([])
const findRole = ref( localStorage.getItem('role'));
const findBranch = ref( JSON.parse(localStorage.getItem('filial_id'))); 
const form_data = ref({
    name: "",
    date: "",
    filial_id: null
})

const rules = {
    name: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == "") {
                return new Error("Dam olish kuni nomi bo'sh ")
            }
        }
    },
}
const getAllBranches = ()=>{
    BranchService.getAll().then((res)=>{
        branchesOptions.value = res
    })
}
onMounted(() => {
    if (props.type == 'update') {
        ModelService.getOne(props.id).then((res) => {
            form_data.value = res;
            today.value = new Date(res.date).getTime();
        })
    }
    if(findRole.value == 'SuperAdmin'){
        getAllBranches();
    }
    if(findRole.value != 'SuperAdmin'){
        form_data.value.filial_id = findBranch.value;
    }
})
const spinTime = () => {
    setTimeout(() => {
        spinBtn.value = false;
    }, 500)
}
const save = async () => {
    try {
        const result = await formRef.value?.validate();
        if (props.type == 'create') {
            spinBtn.value = true;
            form_data.value.date = `${dayJS(today.value).format('YYYY-MM-DD')}`
            ModelService.create(form_data.value).then((res) => {
                emit('create', res)
                spinTime()
            }).catch(() => {
                spinTime()
            })
        } else if (props.type == 'update') {
            spinBtn.value = true;
            form_data.value.date = `${dayJS(today.value).format('YYYY-MM-DD')}`
            ModelService.update(props.id, form_data.value).then((res) => {
                emit('update', res)
                spinTime()
            }).catch(() => {
                spinTime()
            })
        }
    } catch (e) {
    }
}
const keySave = (e) => {
    if (e.key == "Enter") {
        save()
    }
}
</script>
<template>
    <div class="111">
        <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data" :rules="rules">
            <n-spin :show="spinBtn">
                <n-form-item label="Sana" path="date">
                    <n-date-picker 
                        v-model:value="today" 
                        :style="{width:'100%'}">
                    </n-date-picker>
                </n-form-item>
                <n-form-item label="Filial" path="filial_id" v-if="findRole == 'SuperAdmin'">
                    <n-select
                        v-model:value="form_data.filial_id"
                        :options="branchesOptions"
                        label-field="name"
                        value-field="id"
                        filterable
                        clearable
                    ></n-select>
                </n-form-item>
                <n-form-item label="Nomi" path="name">
                    <n-input 
                        @keydown="keySave" 
                        v-model:value="form_data.name"  
                        clearable>
                    </n-input>
                </n-form-item>
                <n-button @click="save" block type="success">Saqlash</n-button>
            </n-spin>
        </n-form>
    </div>
</template>
