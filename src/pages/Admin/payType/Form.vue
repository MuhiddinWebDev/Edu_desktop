<script setup>
import { ref, onMounted, inject} from 'vue'
import ModelService from '../../../services/payType.service';
// variables 
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update'])
const formRef = ref(null);
const spinBtn = ref(false);

const findRole = ref( localStorage.getItem('role'));
const findBranch = ref( JSON.parse(localStorage.getItem('filial_id'))); 

const form_data = ref({
    name: "",
})

const rules = {
    name: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == "") {
                return new Error("Nomi bo'sh ")
            }
        }
    },
}

onMounted(() => {
    if (props.type == 'update') {
        ModelService.getOne(props.id).then((res) => {
            form_data.value = res;
        })
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
            ModelService.create(form_data.value).then((res) => {
                emit('create', res)
                spinTime()
            }).catch(() => {
                spinTime()
            })
        } else if (props.type == 'update') {
            spinBtn.value = true;
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
    <div class="tetsttts">
        <n-form :style="{ height: '100%' }" ref="formRef" :model="form_data" :rules="rules">
            <n-spin :show="spinBtn">
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
