<script setup>
import { ref, onMounted, watch, inject } from "vue";
import { useMessage } from "naive-ui";
import ModelService from "../../../services/course.service";
import {
    Save24Filled as SaveIcon,
    Checkmark48Filled as CheckIcon,
    ErrorCircle24Filled as offlineIcon
} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5"
import {
    LanguageTwotone as langIcon,
    AppRegistrationSharp as planIcon
} from "@vicons/material";
import { Course as courseIcon} from "@vicons/carbon"
import { useCounterStore } from "../../../stores/counter";
const counter = useCounterStore();
const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close']);
const formRef = ref('');
const showFeedback = ref(false);
const fileList = ref([]);
const img_url = inject('course_img');
const play_url = inject('course_video');
const courseWrapper = ref(true);
const coursePlanWrapper = ref(false);
const spinBtn = ref(false);
const photo_url = ref('');
const video_url = ref('');
const message = useMessage()
const form_data = ref({
    name: "",
    level: null,
    lang: "",
    price_month: 0,
    price_full: 0,
    online: false,
    teacher_id: JSON.parse(localStorage.getItem('id')),
    image: ''
}); 

const rules = {
    name: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == '') {
                showFeedback.value = true;
                return new Error("Iltimos nomini kiritng")
            }
        }
    },
    level: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == null) {
                showFeedback.value = true;
                return new Error("Iltimos darajani tanlang")
            }
        }
    },
    image: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == '') {
                showFeedback.value = true;
                return new Error("Iltimos rasm yuklang")
            }
        }
    },
    teacher_id: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == null) {
                showFeedback.value = true;
                return new Error("Iltimos o'qtiuvchini tanlang")
            }
        }
    },

}
//// select options 
const levelOption = [
    {
        name: "Boshlang'ich",
        level: 'junior'
    },
    {
        name: "O'rtacha",
        level: 'middle'
    },
    {
        name: "Murakkab",
        level: 'senior'
    }
]
const teacherList = [
    {
        id: 1,
        name: 'Muhiddin',
    },
    {
        id: 2,
        name: 'Sanjar',
    },
    {
        id: 3,
        name: 'Muhammadjon',
    },
    {
        id: 4,
        name: 'Nurmuhammad',
    }
]
//////
const courseId = ref(null)
const course_plane_id = ref(null)
onMounted(() => {
    if (props.type == 'update'){
        if(counter.teacherCourse){
            courseWrapper.value = false;
            coursePlanWrapper.value = true;
        }else{
            courseWrapper.value = true;
            coursePlanWrapper.value = false;
        }
        ModelService.getOneTeacher(props.id).then((res) => {
            courseId.value = res.id
            form_data.value = res;
            photo_url.value = img_url + res.image;
            customValue.value = res.course_plan;
            res.course_plan.forEach((plan) => {
                video_url.value = play_url + plan.video;
                course_plane_id.value = plan.id
            })
            showPrice.value = res.online
        })
    }
})
/// upload image funciton
watch(fileList, (val) => {
    form_data.value.image = val[0].file.name;
})
//
/// swicht Action 
const showPrice = ref(false);
const changeAction = (act) => {
    form_data.value.online = act;
    showPrice.value = act;
}
////////////////////////////////
// swicht start
const changeLang = (lang) => {
    if (lang) {
        form_data.value.lang = 'uz';
    } else {
        form_data.value.lang = 'ru';
    }
}
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
const exit = () => {
    emit('close')
}
watch(form_data.value, (item)=>{
    if(item.online){
        item.price_month = 0;
    }else{
        item.price_full = 0;
    }
})
const save = async () => {
    try {
        const result = await formRef.value?.validate();
        if (props.type == 'create') {
            const sendData = new FormData();
            sendData.append('image', fileList.value[0].file);
            sendData.append('name', form_data.value.name);
            sendData.append('level', form_data.value.level);
            sendData.append('lang', form_data.value.lang);
            if(showPrice.value){
                sendData.append('price_full', form_data.value.price_full);
                sendData.append('price_month', 0);
            }else{
                sendData.append('price_full', 0);
                sendData.append('price_month', form_data.value.price_month);
            }
            sendData.append('online', form_data.value.online);
            sendData.append('teacher_id', form_data.value.teacher_id);
            spinBtn.value = true;
            ModelService.teacherCreate(sendData).then((res) => {
                setTimeout(() => {
                    spinBtn.value = false;
                    emit('create', res)
                }, 500)
            }).catch((err) => {
                spinBtn.value = false;
                message.error("Ma'lumotlarda xatolik bor ")
            })
        } else if (props.type == 'update') {
            const sendData = new FormData();
            if (fileList.value.length > 0) {
                sendData.append('image', fileList.value[0].file);
                sendData.append('change_image', true);
            } else {
                sendData.append('image', form_data.value.image);
                sendData.append('change_image', false)
            }
            sendData.append('name', form_data.value.name);
            sendData.append('level', form_data.value.level);
            sendData.append('lang', form_data.value.lang);
            if(showPrice.value){
                sendData.append('price_full', form_data.value.price_full);
                sendData.append('price_month', 0);
            }else{
                sendData.append('price_full', 0);
                sendData.append('price_month', form_data.value.price_month);
            }
            
            sendData.append('online', form_data.value.online);
            sendData.append('teacher_id', form_data.value.teacher_id);
            spinBtn.value = true
            ModelService.updateTeacher(props.id, sendData).then((res) => {
                setTimeout(() => {
                    spinBtn.value = false;
                    emit('update', res)
                }, 500)
            }).catch((err) => {
                spinBtn.value = false;
                message.error("Ma'lumotlarda xatolik bor ")
            })
        }
    } catch (e) {
    }
}
//// plan course function and dynamic inputs;
const spinTwo = ref(false);
const planCourse = () => {
    spinBtn.value = true;
    setTimeout(() => {
        courseWrapper.value = false;
        coursePlanWrapper.value = true;
        spinBtn.value = false;
    }, 400);
}
const returnCourse = () => {
    spinTwo.value = true;
    setTimeout(() => {
        courseWrapper.value = true;
        coursePlanWrapper.value = false;
        spinTwo.value = false;
    }, 400);
}
const customValue = ref([])
const dataCounter = ref(1)

const onCreate = () => {
    return {
        id: new Date().getTime(),
        sequence_number:dataCounter.value++,
        name: "",
        video: "",
        video_duration: ""
    }
}
const videoId = ref(null);
const showId = (idx) => {
    videoId.value = idx;
}
const showAction = (file) => {
    const videoData = new FormData();
    if (file.length > 0) {
        videoData.append('video', file[0].file);
        if(counter.teacherCourse){
            videoData.append('course_id',courseId.value);
            videoData.append('course_plan_id',course_plane_id.value);
            ModelService.uploadVideoTeacher(videoData).then((res) => {
                const index = customValue.value.findIndex((item) => item.id == videoId.value);
                customValue.value[index].video = res.video;
                customValue.value[index].video_duration = `${res.duration}`;
            })
        }else{
            videoData.append('course_id',courseId.value);
            videoData.append('course_plan_id',course_plane_id.value);
            ModelService.uploadVideoUpdateTeacher(videoData).then((res) => {
                const index = customValue.value.findIndex((item) => item.id == videoId.value);
                customValue.value[index].video = res.video;
                customValue.value[index].video_duration = `${res.duration}`;
            })
        }
    }
}

const sendPlan = ref({
    course_id: null,
    course_plans: []
})
const PlaneSave = async () => {
    try {
        sendPlan.value.course_id = courseId.value;
        sendPlan.value.course_plans = customValue.value;
        if(counter.teacherCourse){
            ModelService.teacherCreatePlan(sendPlan.value).then((res) => {
                emit('update', res)
            });
        }else{
            ModelService.teacherUpdatePlan(sendPlan.value).then((res) => {
                emit('update', res)
            });
        }
    }
    catch (e) {

    }
}
/////////////////////////
</script>
<template>
    <div class="user-message">
        <n-form :model="form_data" ref="formRef" :rules="rules">
            <section v-if="courseWrapper" class="course-wrapper">
                <n-spin size="large" :show="spinBtn">
                    <div class="user-message-header">
                        <n-grid :cols="2" :x-gap="15" :y-gap="12">
                            <n-gi>
                                <div class="grid-item">
                                    <n-card size="small">
                                        <template #cover>
                                            <n-tag size="large" :style="{ width: '100%', padding: '12px 20px' }">
                                                <p style="text-align:center;">Rasm</p>
                                            </n-tag>
                                            <n-divider
                                                :style="{ padding: '0px 0px 12px 0px ', margin: '0px' }"></n-divider>
                                        </template>
                                        <div class="d-flex-center">
                                            <n-form-item :show-feedback="showFeedback" :show-label="false" path="image">
                                                <n-upload accept="image/jpeg , image/png" :max="1"
                                                    list-type="image-card" v-model:file-list="fileList"></n-upload>
                                            </n-form-item>
                                            <n-image v-if="props.type == 'update'" :src='photo_url' :width="96"
                                                :height="96"></n-image>
                                        </div>
                                    </n-card>
                                </div>
                            </n-gi>
                            <n-gi>
                                <div class="grid-item">
                                    <n-form-item :show-feedback="showFeedback" label="O'qituvchi" path="teacher_id">
                                        <n-select :disabled="true" v-model:value="form_data.teacher_id" :options="teacherList"
                                            label-field="name" value-field="id" filterable clearable></n-select>
                                    </n-form-item>

                                    <n-form-item :show-feedback="showFeedback" label="Darajasi" path="level">
                                        <n-select v-model:value="form_data.level" :options="levelOption"
                                            label-field="name" value-field="level" filterable clearable></n-select>
                                    </n-form-item>
                                </div>
                            </n-gi>
                            <n-gi>
                                <div class="grid-item">
                                    <n-form-item :show-feedback="showFeedback" label="Tili" path="lang">
                                        <n-switch @update:value="changeLang"
                                            :value="form_data.lang == 'uz' ? true : false" :rail-style="railStyle">
                                            <template #icon>
                                                <n-icon>
                                                    <lang-icon />
                                                </n-icon>
                                            </template>
                                            <template #checked>
                                                Uzbek
                                            </template>
                                            <template #unchecked>
                                                Russia
                                            </template>
                                        </n-switch>
                                    </n-form-item>
                                    <n-form-item :show-feedback="showFeedback" label="Nomi" path="name">
                                        <n-input v-model:value="form_data.name" :maxlength="64" show-count
                                            clearable></n-input>
                                    </n-form-item>
                                </div>
                            </n-gi>
                            <n-gi>
                                <div class="grid-item">
                                    <n-form-item :show-feedback="showFeedback" label="Xolati" path="online">
                                        <n-switch @update:value="changeAction" v-model:value="form_data.online"
                                            :rail-style="railStyle">
                                            <template #checked-icon>
                                                <n-icon>
                                                    <check-icon />
                                                </n-icon>
                                            </template>
                                            <template #unchecked-icon>
                                                <n-icon>
                                                    <offline-icon />
                                                </n-icon>
                                            </template>
                                            <template #checked>
                                                Online
                                            </template>
                                            <template #unchecked>
                                                Offline
                                            </template>
                                        </n-switch>
                                    </n-form-item>
                                    <n-form-item v-if="showPrice == false" :show-feedback="showFeedback"
                                        label="Oylik narxi" path="price_month">
                                        <n-input-number :show-button="false" v-model:value="form_data.price_month"
                                            clearable></n-input-number>
                                    </n-form-item>
                                    <n-form-item v-if="showPrice == true" :show-feedback="showFeedback"
                                        label="To'liq narxi" path="price_full">
                                        <n-input-number :show-button="false" v-model:value="form_data.price_full"
                                            clearable></n-input-number>
                                    </n-form-item>
                                </div>
                            </n-gi>
                        </n-grid>
                    </div>
                    <n-divider></n-divider>
                    <div class="btn-action">
                        <n-button @click="exit" type="warning">
                            <template #icon>
                                <exit-icon />
                            </template>
                            Chiqish
                        </n-button>
                        <n-button @click="save" type="success">
                            <template #icon>
                                <n-icon>
                                    <save-icon />
                                </n-icon>
                            </template>
                            Saqlash
                        </n-button>
                        <n-button v-if="props.type == 'update'" @click="planCourse" type="success">
                            <template #icon>
                                <n-icon>
                                    <plan-icon />
                                </n-icon>
                            </template>
                            Kurs reja
                        </n-button>
                    </div>
                </n-spin>
            </section>
            <section v-if="coursePlanWrapper" class="course-plan-wrapper">
                <n-spin :show="spinTwo">
                    <h2>Kurs nomi: {{ form_data.name }}</h2>
                    <div class="user-message-header" id="dynamicInput">
                        <n-dynamic-input class="prive-input" :min="1" v-model:value="customValue" :on-create="onCreate"
                            show-sort-button>
                            <template #default="{ value }">
                                <n-card>
                                    <div class="d-input-flex">
                                        <n-input-group>
                                            <n-input-group-label>Nomi</n-input-group-label>
                                            <n-input :style="{ width: '100%' }" v-model:value="value.name" />
                                        </n-input-group>
                                        <n-divider :style="{ margin: '12px 0px' }"></n-divider>
                                        <n-upload @click="showId(value.id)"
                                            accept="video/mp4 , video/mov, video/m4a0, video/3gp " size="small"
                                            style="display: flex;align-items: center;" :max="1"
                                            @update:file-list="showAction">
                                            <n-button :style="{ width: '100%' }" type="success">Video yuklash</n-button>
                                        </n-upload>
                                        <pre>{{ JSON.stringify(customValue, null, 2) }}</pre>
                                    </div>
                                </n-card>
                            </template>
                        </n-dynamic-input>
                    </div>
                    <n-divider></n-divider>
                    <div class="btn-action">
                        <n-button @click="exit" type="warning">
                            <template #icon>
                                <exit-icon />
                            </template>
                            Chiqish
                        </n-button>
                        <n-button @click="PlaneSave" type="success">
                            <template #icon>
                                <n-icon>
                                    <save-icon />
                                </n-icon>
                            </template>
                            Saqlash
                        </n-button>
                        <n-button @click="returnCourse" type="success">
                            <template #icon>
                                    <n-icon>
                                        <course-icon />
                                    </n-icon>
                                </template>
                            Kursga qaytish
                        </n-button>
                    </div>
                </n-spin>
            </section>
        </n-form>
    </div>
</template>

<style scoped>
.d-flex-center {
    display: flex;
    justify-content: space-evenly;
    gap: 20px;
    flex-wrap: wrap;
}

.d-input-flex {
    display: grid;
    align-items: baseline;
}

.btn-action {
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: 12px;
}

.grid-item {
    display: grid;
    gap: 18px;
}

#dynamicInput {
    max-height: 520px;
    overflow: hidden;
    overflow-y: auto;
    padding-right: 12px;
}
</style>