<script setup>
import { ref, onMounted, inject } from 'vue'
import ModelService from '../../../services/site.service';
//// variables 
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close'])
const formRef = ref(null);
const img_url = inject('site_img');
const photo_url = ref('');
const spinBtn = ref(false);
const file_list = ref([])
const form_data = ref({
    image: '',
    title_uz: '',
    title_ru: '',
    text_uz: '',
    text_ru: '',
    row: 0,
    comment_uz: '',
    comment_ru: '',
    action:null
})
const rules = {
}
const ActionOption = [
    {
        label:'Index',
        value: 'index'
    },
    {
        label:'Kurs',
        value: 'course'
    },
    {
        label:'Kontakt',
        value: 'contact'
    },
]
onMounted(() => {
    if (props.type == 'update') {
        ModelService.getOne(props.id).then((res) => {
            photo_url.value = img_url + res.image;
            form_data.value = res;
            form_data.value.row = Number(res.row)
        })
    }
})
const save = async () => {
    try {
        if (props.type == 'create') {
            const sendData = new FormData();
            if(file_list.value.length > 0){
                sendData.append('image', file_list.value[0].file);
            }
            sendData.append('title_uz', form_data.value.title_uz);
            sendData.append('title_ru', form_data.value.title_ru)
            sendData.append('text_uz', form_data.value.text_uz);
            sendData.append('text_ru', form_data.value.text_ru);
            sendData.append('row', form_data.value.row);
            sendData.append('action', form_data.value.action);
            sendData.append('comment_uz', form_data.value.comment_uz);
            sendData.append('comment_ru', form_data.value.comment_ru);
            spinBtn.value = true
            ModelService.create(sendData).then((res) => {
                emit('create', res)
                spinBtn.value = false
            }).catch(() => {
                spinBtn.value = false
            })
        } else if (props.type == 'update') {
            const sendData = new FormData();
            if (file_list.value.length > 0) {
                sendData.append('image', file_list.value[0].file);
                sendData.append('change_image', "true");
            } else {
                sendData.append('image', form_data.value.image);
                sendData.append('change_image', "false")
            }
            sendData.append('title_uz', form_data.value.title_uz);
            sendData.append('title_ru', form_data.value.title_ru)
            sendData.append('text_uz', form_data.value.text_uz);
            sendData.append('text_ru', form_data.value.text_ru);
            sendData.append('row', form_data.value.row);
            sendData.append('action', form_data.value.action);
            sendData.append('comment_uz', form_data.value.comment_uz);
            sendData.append('comment_ru', form_data.value.comment_ru);
            spinBtn.value = true
            ModelService.update(props.id, sendData).then((res) => {
                emit('update', res)
                spinBtn.value = false
            }).catch(() => {
                spinBtn.value = false
            })
        }
    } catch (e) {
        console.log(e)
    }
}
</script>
<template>
    <div>
        <n-form ref="formRef" :model="form_data" :rules="rules">
            <div class="modal-parent">
                <div class="modal-box">
                    <n-grid :x-gap="12" :y-gap="12" :cols="2">
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p>Rasm yuklash</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-grid :x-gap="12" :cols="2">
                                    <n-gi>
                                        <n-upload :max="1" accept="image/png, image/jpeg" list-type="image-card"
                                            v-model:file-list="file_list">
                                        </n-upload>
                                    </n-gi>
                                    <n-gi>
                                        <n-image v-if="props.type == 'update'" :width="94" :height="94" :src="photo_url">
                                        </n-image>
                                    </n-gi>

                                </n-grid>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Qatori</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input-number v-model:value="form_data.row"></n-input-number>
                                <n-divider :style="{margin:'14px 0px'}"></n-divider>
                                <n-select :options="ActionOption" filterable clearable v-model:value="form_data.action"></n-select>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Sarlovha UZB</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="text" v-model:value="form_data.title_uz"></n-input>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Sarlovha RUS</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="text" v-model:value="form_data.title_ru"></n-input>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Matn UZB</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="textarea" v-model:value="form_data.text_uz"></n-input>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Matn RUS</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="textarea" v-model:value="form_data.text_ru"></n-input>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Izoh UZB</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="textarea" v-model:value="form_data.comment_uz"></n-input>
                            </n-card>
                        </n-gi>
                        <n-gi>
                            <n-card size="small">
                                <template #cover>
                                    <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                        <p style="text-align:center;">Izoh RUS</p>
                                    </n-tag>
                                    <n-divider :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                </template>
                                <n-input type="textarea" v-model:value="form_data.comment_ru"></n-input>
                            </n-card>
                        </n-gi>
                    </n-grid>
                    <div class="modal-box-footer">
                        <div class="modal-box-footer_item">
                            <n-spin :show="spinBtn">
                                <n-button @click="save" block type="success">Saqlash</n-button>
                            </n-spin>
                        </div>
                    </div>
                </div>
            </div>
        </n-form>
    </div>
</template>

<style scoped>
.modal-box-footer {
    display: flex;
    align-items: center;
    justify-content: flex-end;
}

.modal-box-footer_item {
    width: 33%;
    margin-top: 12px;
}
</style>