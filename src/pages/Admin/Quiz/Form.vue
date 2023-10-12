<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/quiz.service";
import { Save24Filled as SaveIcon} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5"
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close']);
const form_data = ref({
    question_uz:"",
    question_ru:"",
    answer_uz:"",
    answer_ru:""

});
const formRef = ref('');
const showFeedback = ref(false)
const rules = {
    question_uz:{
        required:true,
        trigger:'blur',
        validator:(rule, value)=>{
            if(value == ''){
                showFeedback.value = true;
                return new Error("Iltimos ma'lumot kiritng")
            }
        }
    },
    question_ru:{
        required:true,
        trigger:'blur',
        validator:(rule, value)=>{
            if(value == ''){
                showFeedback.value = true;
                return new Error("Iltimos ma'lumot kiritng")
            }
        }
    },
    answer_uz:{
        required:true,
        trigger:'blur',
        validator:(rule, value)=>{
            if(value == ''){
                showFeedback.value = true;
                return new Error("Iltimos ma'lumot kiritng")
            }
        }
    },
    answer_ru:{
        required:true,
        trigger:'blur',
        validator:(rule, value)=>{
            if(value == ''){
                showFeedback.value = true;
                return new Error("Iltimos ma'lumot kiritng")
            }
        }
    },
}

onMounted(() => {
    if(props.type =='update'){
        ModelService.getOne(props.id).then((res) => {
            form_data.value = res;
        })
    }
})
const exit = ()=>{
    emit('close')
}
const save = async ()=>{
    try{
        const result = await formRef.value?.validate();
        if(props.type == 'create'){
            ModelService.create(form_data.value).then((res) => {
                emit('create',res)
            })
        }else if(props.type == 'update'){
            ModelService.update(props.id , form_data.value).then((res)=>{
                emit('update',res)
            })
        }
    } catch(e) {

    }
}
</script>
<template>
    <div class="user-message">
        <n-form :model="form_data" ref="formRef" :rules="rules">
            <div class="user-message-header">
                <n-grid cols="1 s:1 m:2 l:2" :x-gap="12" :y-gap="12" responsive="screen">
                    <n-grid-item>
                        <n-card size="small">
                            <template #cover>
                                <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                    <p style="text-align:center;">Savol Uz</p>
                                </n-tag>
                                <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                            </template>
                            <n-form-item :show-feedback="showFeedback" :show-label="false" path="question_uz">
                                <n-input v-model:value="form_data.question_uz"  type="textarea" :maxlength="256" show-count clearable></n-input>
                            </n-form-item>
                        </n-card>
                        
                    </n-grid-item>
                    <n-grid-item>
                        <n-card size="small">
                            <template #cover>
                                <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                    <p style="text-align:center;">Savol Ru</p>
                                </n-tag>
                                <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                            </template>
                            <n-form-item :show-feedback="showFeedback" :show-label="false" path="question_ru">
                                <n-input v-model:value="form_data.question_ru" type="textarea" :maxlength="256" show-count clearable></n-input>
                            </n-form-item>
                        </n-card>
                        
                    </n-grid-item>
                    <n-grid-item>
                        <n-card size="small">
                            <template #cover>
                                <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                    <p style="text-align:center;">Javob Uz</p>
                                </n-tag>
                                <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                            </template>
                            <n-form-item :show-feedback="showFeedback" :show-label="false" path="answer_uz">
                                <n-input v-model:value="form_data.answer_uz" type="textarea" clearable></n-input>
                            </n-form-item>
                        </n-card>
                        
                    </n-grid-item>
                    <n-grid-item>
                        <n-card size="small">
                            <template #cover>
                                <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                    <p style="text-align:center;">Javob Ru</p>
                                </n-tag>
                                <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                            </template>
                            <n-form-item :show-feedback="showFeedback" :show-label="false" path="answer_ru">
                                <n-input v-model:value="form_data.answer_ru" type="textarea" clearable></n-input>
                            </n-form-item>
                        </n-card>
                        
                    </n-grid-item>
                </n-grid>
            </div>
            <n-divider :style="{margin:'12px 0px'}" ></n-divider>
            <div class="btn-action">
                <n-button @click="exit" type="warning">
                    <template #icon>
                        <exit-icon/>
                    </template>
                    Chiqish
                </n-button>
                <n-button @click="save" type="success">
                    <template #icon>
                        <n-icon>
                            <save-icon/>
                        </n-icon>
                    </template>
                    Saqlash
                </n-button>
            </div>
        </n-form>
    </div>
</template>

<style scoped>
.btn-action{
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}
.user-message-header{
    max-height: 400px;
    overflow: hidden;
    overflow: auto;
}
</style>