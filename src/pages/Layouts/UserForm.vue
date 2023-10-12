<script setup>
import { ref, onMounted, inject } from 'vue';
// import ModelService from "../../services/users.service.js"
// const props = defineProps(['type', 'id']);
// const emit = defineEmits(['create', 'update', 'close']);
onMounted(() => {
    // ModelService.getAll().then((res)=>{
    //     console.log(res)
    // })
})
const file_list = ref([]);
const img_url = inject('img_url');
const form_data = ref({
    phone: '',
    fullname: '',
    password: '',
    confirmPassword: '',
    image: '',
    change_image: false
})
const showModal = ref(false);
const handlePreview = (file)=>{
    const { url } = file;
      file_list.value = url;
      showModal.value = true;
}
</script>
<template>
    <n-form :model="form_data">
        <div class="model-setting">
            <div class="model-setting_item image">
                <div class="image_item">
                    <n-upload :max="1" action="https://www.mocky.io/v2/5e4bafc63100007100d8b70f"
                        :default-file-list="file_list" list-type="image-card" @preview="handlePreview" />
                    <n-modal v-model:show="showModal" preset="card" style="width: 600px" title="A Cool Picture">
                        <img :src="file_list" style="width: 100%">
                    </n-modal>
                </div>
            </div>
            <n-divider></n-divider>
            <div class="model-setting_item">
                <n-form-item label="F.I.O" path="fullaname">
                    <n-input :maxlength="50" :minlength="3" show-count clearable v-model:value="form_data.fullname" />
                </n-form-item>
            </div>
            <div class="model-setting_item">
                <n-form-item label="Telefon raqam" path="phone">
                    <n-input :maxlength="25" :minlength="8" show-count clearable v-model:value="form_data.phone" />
                </n-form-item>
            </div>
            <div class="model-setting_item">
                <n-form-item label="Parol" path="password">
                    <n-input 
                        type="password" 
                        :minlength="8" 
                        show-count 
                        clearable 
                        v-model:value="form_data.password"
                        show-password-on="mousedown" />
                </n-form-item>
            </div>
            <div class="model-setting_item">
                <n-form-item label="Test" path="password">
                    <n-input type="password" :minlength="8" show-count clearable
                        v-model:value="form_data.confirmPassword" show-password-on="mousedown" />
                </n-form-item>
            </div>
            <n-divider></n-divider>
            <n-button type="success" block>Saqlash</n-button>
            <n-divider></n-divider>

        </div>
    </n-form>
</template>
<style scoped>
.image{
    display: grid;
    place-items: center;
}
</style>