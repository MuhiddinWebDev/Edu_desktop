<script setup>
import { ref, onMounted, watch } from "vue";
import ModelService from "../../../services/attendance.service";
import GroupService from "../../../services/groups.service";
import CourseService from "../../../services/course.service";
import UserService from "../../../services/users.service";
import {
    Save24Filled as SaveIcon,
} from "@vicons/fluent";
import { Exit as ExitIcon } from "@vicons/ionicons5"

const props = defineProps(['type', 'id']);
const emit = defineEmits(['create', 'update', 'close']);
const formRef = ref('');
const showFeedback = ref(false);
const spinBtn = ref(false)

////// select options
const groupsOptions = ref([])
const coursesOptions = ref([])
const teacherOptions = ref([])
const studentOptions = ref([])
/////  select options

const form_data = ref({
    teacher_id: null,
    student_id: null,
    group_id: null,
    date: "2023-03-08",
    apsent: false,
    because: false,
});
const getAllTeachers = () => {
    UserService.getAllTeacher().then((res) => {
        teacherOptions.value = res;
    })
}
const getAllCourses = () => {
    CourseService.getAll().then((res) => {
        coursesOptions.value = res;
    });
}
const getAllGroups = () => {
    GroupService.getAll().then((res) => {
        groupsOptions.value = res;
    });
}
const getAllStudents = () => {
    UserService.getAllStudent().then((res) => {
        studentOptions.value = res;
    });
}
const rules = {
    group_id: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == null) {
                showFeedback.value = true;
                return new Error("Iltimos guruhni tanlang")
            }
        }
    },
    course_id: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == null) {
                showFeedback.value = true;
                return new Error("Iltimos kursni tanlang")
            }
        }
    },
    teacher_id: {
        required: true,
        trigger: 'blur',
        validator: (rule, value) => {
            if (value == null) {
                showFeedback.value = true;
                return new Error("Iltimos xona tanlang")
            }
        }
    },
}

onMounted(() => {
    if (props.type == "update") {
        ModelService.getOneUpdate(props.id).then((res) => {
            form_data.value = res;
        })
    }
    getAllTeachers();
    getAllCourses();
    getAllGroups();
    getAllStudents();
})
const switchUpdate = (event)=>{
    if(form_data.value.because && event == false){
        form_data.value.because = false;
    }
}
const exit = () => {
    emit('close')
}
const save = async () => {
    try {
        const result = await formRef.value?.validate();
        if (props.type == 'update') {
            ModelService.update(props.id, form_data.value).then((res) => {
                emit('update', res);
            })
        }
    } catch (e) {
    }
}

</script>
<template>
    <div class="user-message">
        <n-form :model="form_data" ref="formRef" :rules="rules">
            <n-spin size="large" :show="spinBtn">
                <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="12" :y-gap="4">
                    <n-grid-item>
                        <n-form-item label="Guruh" path="group_id">
                            <n-select :disabled="true" :options="groupsOptions" label-field="name" value-field="id"
                                v-model:value="form_data.group_id">
                            </n-select>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="Kurs" path="course_id">
                            <n-select :disabled="true" :options="coursesOptions" label-field="name" value-field="id"
                                v-model:value="form_data.course_id">
                            </n-select>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="O'qituvchi" path="teacher_id">
                            <n-select :disabled="true" :options="teacherOptions" label-field="fullname" value-field="id"
                                v-model:value="form_data.teacher_id">
                            </n-select>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="Talaba" path="student_id">
                            <n-select :disabled="true" :options="studentOptions" label-field="fullname" value-field="id"
                                v-model:value="form_data.student_id">
                            </n-select>
                        </n-form-item>
                    </n-grid-item>
                    <n-grid-item>
                        <n-form-item label="Talaba" path="next_lesson">
                            <n-grid :cols="2" :x-gap="6">
                                <n-grid-item>
                                    <div class="d-flex-row">
                                        <n-switch @update:value="switchUpdate" v-model:value="form_data.apsent" :round="false" />
                                        <div v-if="form_data.apsent" class="padding">
                                            <n-gradient-text type="error">
                                                Kelmadi
                                            </n-gradient-text>
                                        </div>
                                        <div v-else class="padding">
                                            <n-gradient-text type="success">
                                                Keldi
                                            </n-gradient-text>
                                        </div>
                                    </div>
                                </n-grid-item>
                                <n-grid-item>
                                    <div class="d-flex-row">
                                        <n-switch :disabled="!form_data.apsent" v-model:value="form_data.because" :round="false" />
                                        <div v-if="form_data.because" class="padding">
                                            <n-gradient-text type="success">
                                                Sababli
                                            </n-gradient-text>
                                        </div>
                                        <div v-else class="padding">
                                            <n-gradient-text type="error">
                                                Sababsiz
                                            </n-gradient-text>
                                        </div>
                                    </div>
                                </n-grid-item>
                            </n-grid>

                        </n-form-item>
                    </n-grid-item>
                </n-grid>
                <n-divider :style="{ margin: '12px 0px' }"></n-divider>
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

                </div>
            </n-spin>

        </n-form>
    </div>
</template>

<style scoped>
.btn-action {
    display: flex;
    justify-content: flex-end;
    align-items: center;
    gap: 8px;
}
.d-flex-row{
    display: flex;
    align-items: center;
    gap: 12px;
    margin: 7px 0px;
}
.padding {
    padding: 0px 8px;
}
</style>