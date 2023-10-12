<script setup>
import { ref, onMounted, inject} from 'vue'
import ModelService from '../../../services/dayOff.service';
// variables 
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update'])
const formRef = ref(null);
const spinBtn = ref(false);
const dayJS = inject('dayJS');
const today = ref( new Date().getTime());
const form_data = ref({
    name: "",
    date: "",
})
const rules = {
    name: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == "") {
                return new Error("Filia nomi  bo'sh ")
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
        const result = await formRef.value?.validate()
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
                    <n-date-picker v-model:value="today" :style="{width:'100%'}"></n-date-picker>
                </n-form-item>
                <n-form-item label="Nomi" path="name">
                    <n-input @keydown="keySave" v-model:value="form_data.name"  clearable></n-input>
                </n-form-item>
                <n-button @click="save" block type="success">Saqlash</n-button>
            </n-spin>
        </n-form>
    </div>
</template>
