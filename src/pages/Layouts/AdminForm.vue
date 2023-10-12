<script setup>
import { ref, onMounted, inject } from 'vue';
import ModelService from "../../services/users.service.js"
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close']);
const file_list = ref([]);
const img_url = inject('img_url');
const photo_url = ref("");
const formRef = ref(null);
const spinBtn = ref(false);
const showPassword = ref(false);
const form_data = ref({
    phone: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    image: '',
    lang:'',
    filial_id : JSON.stringify(localStorage.getItem('filial_id'))
})
onMounted(() => {
    if (props.type == 'update') {
        ModelService.getOne(props.id).then((res) => {
            form_data.value = res;
            photo_url.value = `${img_url}/${res.image}`;
            form_data.value.password = ""
            form_data.value.confirmPassword = ""
        })
    }
})
///// update profile image and infos
const rules = {
    phone: {
        required: true,
        trigger: 'blur',
        validator(rule, value) {
            if (value == '') {
                return new Error("Bo'sh bo'lishi mumkin emas")
            } else if (value.length < 3) {
                return new Error("Telefon raqam [3:25] oraliqda bo'lishi majburiy")
            }
        }
    },
    fullname: {
        required: true,
        trigger: 'blur',
        validator(rule, value) {
            if (value == '') {
                return new Error("Bo'sh bo'lishi mumkin emas")
            } else if (value.length < 3) {
                return new Error("F.I.O [3:50] oraliqda bo'lishi majburiy")
            }
        }
    },
    confirmPassword: {
        required: true,
        trigger: 'blur',
        validator(rule, value) {
            if (value != form_data.value.password) {
                return new Error('Tasdiqlash paroli yangi parol bilan bir xil bo\'lishi kerak ')
            }
        }
    },
    password: {
        required: true,
        trigger: 'blur',
        validator(rule, value) {
            if (form_data.value.password == undefined  && showPassword.value == true) {
                return new Error("Parol bo'sh bo'lishi mumkin emas")
            }
        }
    }
}
const save = async () => {
    try {
        const result = await formRef.value?.validate();
        if (props.type == 'update') {
            const sendData = new FormData();
            if (file_list.value.length > 0) {
                sendData.append('image', file_list.value[0].file);
                sendData.append('change_image', "true");
            } else {
                sendData.append('image', form_data.value.image);
                sendData.append('change_image', "false")
            }
            sendData.append('phone', form_data.value.phone);
            sendData.append('lang', form_data.value.lang);
            sendData.append('password', form_data.value.password);
            sendData.append('confirmPassword', form_data.value.confirmPassword);
            sendData.append('fullname', form_data.value.fullname);
            sendData.append('filial_id', form_data.value.filial_id);

            spinBtn.value = true
            ModelService.update(props.id, sendData).then((res) => {
                emit('update', res)
                spinBtn.value = false
            }).catch((err) => {
                spinBtn.value = false
            })
        }

    } catch (e) {
    }
}
///// change password funcctions
const passwordBtn = ()=>{
    showPassword.value ? showPassword.value = false: showPassword.value = true;
}
////////////////////////////////
// swicht start

const railStyle = ({
    focused,
    checked
}) => {
    const style = {};
    if (checked) {
        style.background = "#253e35";
        if (focused) {
            style.boxShadow = "0 0 0 2px #253e35";
        }
    } else {
        style.background = "#2080f0";
        if (focused) {
            style.boxShadow = "0 0 0 2px #2080f040";
        }
    }
    return style;
}

//swtich
const changeLang = (lang)=>{
    if(lang){
        form_data.value.lang = 'uz';
    }else{
        form_data.value.lang = 'ru';
    }
}
</script>
<template>
    <div class="parent">
        <n-form :model="form_data" ref="formRef" :rules="rules">
            <div class="model-setting">
                <div class="model-setting_item image">
                    <div class="image_item">
                        <n-upload :max="1" accept="image/png, image/jpeg" list-type="image-card"
                            v-model:file-list="file_list">
                        </n-upload>
                        <n-image v-if="form_data.image.length > 0" width="140" height="96" :src="photo_url"></n-image>
                    </div>
                </div>
                <n-divider></n-divider>
                <div class="model-setting_item">
                    <n-form-item label="F.I.O" path="fullname">
                        <n-input :maxlength="50" :minlength="3" show-count clearable
                            v-model:value="form_data.fullname" />
                    </n-form-item>
                </div>
                <div class="model-setting_item">
                    <n-form-item label="Telefon raqam" path="phone">
                        <n-input :maxlength="25" :minlength="8" show-count clearable v-model:value="form_data.phone" />
                    </n-form-item>
                </div>
                <div class="model-setting_item">
                    <n-form-item label="Tili" path="lang">
                        <n-switch @update:value="changeLang" :value="form_data.lang == 'uz' ? true:false" :rail-style="railStyle">
                                <template #checked>
                                    Uzbek
                                </template>
                                <template #unchecked>
                                    Russian
                                </template>
                        </n-switch>
                    </n-form-item>
                </div>
                <div v-if="showPassword" class="model-setting_item">
                    <n-form-item label="Yangi parol" path="password">
                        <n-input type="password" :minlength="8" show-count clearable v-model:value="form_data.password"
                            show-password-on="mousedown" />
                    </n-form-item>
                </div>
                <div v-if="showPassword" class="model-setting_item">
                    <n-form-item label="Yangi parolni tasdiqlash" path="confirmPassword">
                        <n-input type="password" :minlength="8" show-count clearable
                            v-model:value="form_data.confirmPassword" show-password-on="mousedown" />
                    </n-form-item>
                </div>
                <n-button :type="showPassword ? 'error':'warning'"  block @click="passwordBtn">{{ showPassword ? 'Chiqish':"Parolni o'zgartirish" }}</n-button>
                <n-divider></n-divider>
            </div>
            <n-spin :show="spinBtn">
                <n-button type="success" block @click="save">Saqlash</n-button>
            </n-spin>
        </n-form>
    </div>
</template>
<style scoped>
.model-setting{
    overflow: hidden;
    overflow-y:auto;
    padding-right: 12px;
    margin-bottom: 8px;
}
.image {
    display: grid;
    place-items: center;
}
</style>