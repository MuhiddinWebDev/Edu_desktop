<script setup>
import { h, ref, onMounted } from "vue";
import ModelService from "../../../services/attendance.service";
import { NButton, NIcon, useMessage, useDialog } from 'naive-ui';
import GroupsService from "../../../services/groups.service";
import UserService from "../../../services/users.service";
import ModelForm from "./Form.vue";
import {
    Add20Filled as AddIcon,
    PersonDelete24Filled as PersonNo,
    PersonAvailable24Filled as PersonYes
} from "@vicons/fluent";
import {
    TrashCan as TrashIcon,
    Pen as PenICon
} from "@vicons/carbon";
import { useCounterStore } from "../../../stores/counter";
const counter = useCounterStore()
const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const Getdata = ref([]);
const loading = ref(true);
const groupsOptions = ref([]);
const studentsOptions = ref([]);
const studentID = ref(0);
const groupID = ref(0);
const studentName = ref(null)
const getGroupStudent = (group, student) => {
    loading.value = true;
    ModelService.getOneGroupStudent(group, student).then((res) => {
        Getdata.value = res;
        loading.value = false;
    })
}
const getStudentCourseId = (student) => {
    loading.value = true;
    ModelService.getOneStudent(student).then((res) => {
        Getdata.value = res;
        loading.value = false;
    })
}
const getByGroupId = (group) => {
    loading.value = true;
    ModelService.getOneGroup(group).then((res) => {
        Getdata.value = res;
        loading.value = false;
    })
}
const getAllDef = (del) => {
    loading.value = true;
    ModelService.getAll().then((res) => {
        Getdata.value = res;
        loading.value = false;
        res.forEach((item) => {
            if (item.apsent == false) {
                ModelService.delete(item.id);
                const index = Getdata.value.findIndex((child) => child.id == item.id);
                Getdata.value.splice(index, 1);
            }
        })
    })
}
const getAllGroup = (id = 0) => {
    if (id == 0) {
        GroupsService.getAll().then((res) => {
            groupsOptions.value = res;
        });
    }
    else if (id != null) {
        GroupsService.getOne(id).then((res) => {
            studentsOptions.value = [];
            res.group_table.forEach((item) => {
                studentsOptions.value.push({
                    id: item.users.id,
                    fullname: item.users.fullname,
                })
            })
        });
    }
}
const getAllStudents = (id = 0) => {
    UserService.getAllStudent().then((res) => {
        studentsOptions.value = res;
    });
}
const columns = ref([
    {
        title: '№',
        key: 'id',
        width: 50,
    },
    {
        title: 'Sana',
        key: 'date',
        resizable: true,

    },
    {
        title: 'Talaba',
        key: 'user.fullname',
        resizable: true,

    },
    {
        title: 'Guruh',
        key: 'group.name',
        resizable: true,
    },
    {
        title: 'Kurs',
        key: 'course.name',
        resizable: true,
    },
    {
        title: 'Keldi',
        key: 'apsent',
        resizable: true,
        render(row) {
            if (row.apsent) {
                return [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'error',

                        },
                        {
                            icon: () =>
                                h(NIcon, {
                                    component: PersonNo
                                }),
                            default: () => {
                                return "Yo'q"
                            }
                        },
                    )
                ]
            } else {
                return [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'success',

                        },
                        {
                            icon: () =>
                                h(NIcon, {
                                    component: PersonYes
                                }),
                            default: () => {
                                return "Ha"
                            }
                        },
                    )
                ]
            }
        }
    },
    {
        title: 'Sababli',
        key: 'because',
        resizable: true,
        render(row) {
            if (row.because) {
                return [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'success',

                        },
                        {
                            icon: () =>
                                h(NIcon, {
                                    component: PersonYes
                                }),
                            default: () => {
                                return "Ha"
                            }
                        },
                    )
                ]
            } else {
                return [
                    h(
                        NButton,
                        {
                            size: 'small',
                            type: 'error',
                        },
                        {
                            icon: () =>
                                h(NIcon, {
                                    component: PersonNo
                                }),
                            default: () => {
                                return "Yo'q"
                            }
                        },
                    )
                ]
            }
        }
    },
    {
        title: "O'qituchi",
        key: 'teacher.fullname',
        resizable: true,
    },
    {
        title: 'Amallar',
        key: "action",
        width: 140,
        render(row) {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "success",
                        onClick: (e) => {
                            showUpdate.value = true;
                            updateId.value = row.id;
                        }
                    },
                    {
                        icon: () =>
                            h(NIcon, {
                                component: PenICon
                            })
                    }
                ),
                h(
                    NButton,
                    {
                        size: 'small',
                        type: 'error',
                        style: {
                            marginLeft: '12px'
                        },
                        onClick: (e) => {
                            dialog.warning({
                                title: 'Ogohlantirish',
                                content: `${row.id} Rostan ham o'chirasizmi`,
                                positiveText: 'Xa',
                                negativeText: "Yo'q",
                                onPositiveClick: () => {
                                    ModelService.delete(row.id).then((res) => {
                                        const index = Getdata.value.findIndex((val) => val.id == row.id);
                                        Getdata.value.splice(index, 1)
                                        message.success("Ma'lumot o'chirildi")
                                    }).catch((err) => {
                                        message.error("Ma'lumot o'chirilmadi")
                                    })
                                },
                                onNegativeClick: () => {
                                    message.error("Ma'lumot o'chirilmadi")
                                }
                            })
                        }
                    },
                    {
                        icon: () =>
                            h(NIcon, {
                                component: TrashIcon
                            })
                    }
                ),
            ]


        }
    },
]);

onMounted(() => {
    getAllDef()
    getAllGroup();
    getAllStudents();
})
///  create and update functions
const closeCreate = () => {
    showCreate.value = false;
    counter.lesson = false;
}
const createModel = (res) => {
    showCreate.value = false;
    updateId.value = res.id;
    showUpdate.value = true;
    counter.lesson = true;
    Getdata.value = []
    getAllDef();
}
const showClose = (e) => {
    if (e == 'create') {
        showCreate.value = false;
    } else if (e == 'update') {
        showUpdate.value = false;
    }
}
const closeUpdate = () => {
    showUpdate.value = false;
    counter.lesson = false;
}
const updateModel = () => {
    showUpdate.value = false;
    Getdata.value = [];
    getAllDef();
    counter.lesson = false;
}
//// search by group and student =>
const chooseGroup = (id) => {
    studentName.value = null;
    groupID.value = id;
    getAllGroup(id);

}
const chooseStudent = (id) => {
    studentID.value = id;
}
const searchFun = () => {
    if (studentID.value > 0 && groupID.value > 0) {
        getGroupStudent(groupID.value, studentID.value)
    } else if ((studentID.value == 0 && groupID.value == 0) || (studentID.value == null && groupID.value == null)) {
        message.warning("Guruh yoki talabani tanlang");
        getAllDef()
    } else if (studentID.value > 0) {
        getStudentCourseId(studentID.value)
    } else if (groupID.value > 0) {
        getByGroupId(groupID.value)
    }
}
/// search end
</script>
<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-header">
                <div class="box-header_item">
                    <h2>Xodimlar to'lovi</h2>
                </div>
            </div>
            <div class="search-action">
                <div class="search-action_item">
                    <n-input-group>
                        <n-input-group-label>Guruh</n-input-group-label>
                        <n-select placeholder="Qidiruv" @update:value="chooseGroup" clearable filterable
                            :options="groupsOptions" label-field="name" value-field="id"></n-select>
                    </n-input-group>
                </div>
                <div class="search-action_item">
                    <n-input-group>
                        <n-input-group-label>Talaba</n-input-group-label>
                        <n-select v-model:value="studentName" placeholder="Qidiruv" @update:value="chooseStudent" clearable
                            filterable :options="studentsOptions" label-field="fullname" value-field="id"></n-select>
                    </n-input-group>
                </div>
                <div class="search-action_item">
                    <n-button @click="searchFun" type="success">Ko'rish</n-button>
                </div>
            </div>
        </div>
        <div class="box-table">
            <n-data-table :loading="loading" :columns="columns" :data="Getdata" :bordered="true" style="min-width: 1000px;"
                max-height="calc(100vh - 300px)">
            </n-data-table>
        </div>
    </div>
    <!-- Modal create and Update -->
    <section>
        <n-modal transform-orign="center" v-model:show="showCreate" :mask-closable="false">
            <n-card style="max-width: 900px; width: calc(100vw - 15px); max-height:900px;" title="Dars qo'shish"
                :bordered="false" size="large" role="dialog" aria-modal="true" closable @close="showClose('create')">
                <ModelForm @close="closeCreate" @create="createModel" type="create" />
            </n-card>
        </n-modal>
        <n-modal transform-orign="center" v-model:show="showUpdate" :mask-closable="false">
            <n-card style="max-width: 900px; width: calc(100vw - 15px); max-height:900px;" title="Darsni o'zgartirish"
                :bordered="false" size="large" role="dialog" aria-modal="true" closable @close="showClose('update')">
                <ModelForm @close="closeUpdate" type="update" :id="updateId" @update="updateModel" />
            </n-card>
        </n-modal>
    </section>
    <!-- create more  -->
</template>

<style scoped></style>