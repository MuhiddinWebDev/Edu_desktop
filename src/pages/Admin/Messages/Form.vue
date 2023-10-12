<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/contact.service"
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close']);
const form_data = ref({
    fullname: '',
    email: '',
    offer: ''
});
onMounted(() => {
    ModelService.getOne(props.id).then((res) => {
        form_data.value = res
    })
})
</script>
<template>
    <div class="user-message">
        <div class="user-message-header">
            <n-input-group>
                <n-input-group-label>Foydalanuvchi</n-input-group-label>
                <n-input v-model:value="form_data.fullname" :disabled="true"></n-input>
            </n-input-group>
            <n-divider size="small"></n-divider>
            <n-input-group>
                <n-input-group-label>Pochta manzili</n-input-group-label>
                <n-input v-model:value="form_data.email" :disabled="true"></n-input>
            </n-input-group>
            <n-divider size="small">Taklif</n-divider>

        </div>
        <div class="user-message_content">
           <n-scrollbar style="max-height: 320px" trigger="none">
            {{ form_data.offer }}
        </n-scrollbar>
        </div>
    </div>
</template>
