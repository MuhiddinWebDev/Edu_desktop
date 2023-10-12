<script setup>
import { h, ref, onMounted, inject,watch } from "vue";
import { useMagicKeys } from '@vueuse/core';
import ModelService from "../../../services/quiz.service";
import { NButton, NIcon, useMessage, useDialog, NImage } from 'naive-ui';
import ModelForm from "./Form.vue" 
import {
    Add20Filled as AddIcon,
} from "@vicons/fluent";
import {
    TrashCan as TrashIcon,
    Pen as PenICon
} from "@vicons/carbon";

const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const updateId = ref(null);
const data = ref([]);
const getAll = () => {
    ModelService.getAll().then((res) => {
        data.value = res;
    })
}

const columns = ref([
    {
        title: '№',
        key: 'index',
        width: 50,
        render(row){
            return data.value.findIndex((item)=> item.id == row.id) + 1;
        }
    },
    {
        title: 'Savol Uz',
        key: 'question_uz',
        resizable: true,
    },
    {
        title: 'Savol Ru',
        key: 'question_ru',
        resizable: true,
    },
    {
        title: 'Javob Uz',
        key: 'answer_uz',
        resizable: true,
    },
    {
        title: 'Javob Ru',
        key: 'answer_ru',
        resizable: true,

    },
    {
        title: 'Amallar',
        key: "action",
        width:140,
        render(row) {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: "success",
                        onClick: (e) => {
                            showUpdate.value = true;
                            updateId.value = row.id
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
                                        const index = data.value.findIndex((val) => val.id == row.id);
                                        data.value.splice(index, 1)
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
    }
]);

onMounted(() => {
    getAll();
})
///  create and update functions
const closeCreate = () => {
    showCreate.value = false;
}
const createModel = () => {
    showCreate.value = false;
    data.value = []
    message.success("Ma'lumot qo'shildi")
    getAll();
}
const showClose = (e) => {
    if (e == 'create') {
        showCreate.value = false;
    }else if(e == 'update'){
        showUpdate.value = false;
    }
}
const closeUpdate = ()=>{
    showUpdate.value = false
}
const updateModel = ()=>{
    showUpdate.value = false;
    message.success("Ma'lumot yangilandi")
    data.value = []
    getAll()
}
///// window key event start
const { insert/* keys you want to monitor */ } = useMagicKeys();
watch(insert, (v) => {
  if (v)
    showCreate.value = true;
})
//// window key event end
</script>
<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-header">
                <div class="box-header_item">
                    <h2>Savol-Javob</h2>
                </div>
                <div class="box-header_item">
                    <n-button @click="showCreate = true" type="success">
                        <template #icon>
                            <n-icon size="18">
                                <AddIcon />
                            </n-icon>
                        </template>
                        Qo'shish <span class="Insert-key">Insert</span>
                    </n-button>
                    
                </div>
            </div>

        </div>
        <div class="box-table">
            <n-data-table :columns="columns" :data="data" :bordered="true" style="min-width: 1000px; max-height:calc(100vh - 300px)" >
            </n-data-table>
        </div>
    </div>
    <!-- Modal create and Update -->
    <section>
        <n-modal v-model:show="showCreate" :mask-closable="false">
            <n-card
                style="max-width: 800px; width:calc(100vw - 15px); max-height:900px; overflow: hidden;overflow-y: auto;"
                title="Savol-Javob" :bordered="false" size="medium" role="dialog" aria-modal="true" closable
                @close="showClose('create')">
                <ModelForm @close="closeCreate" @create="createModel" type="create" />
            </n-card>
        </n-modal>
        <n-modal v-model:show="showUpdate" :mask-closable="false">
            <n-card
                style="max-width: 800px; width:calc(100vw - 15px); max-height:900px; overflow: hidden;overflow-y: auto;"
                title="Savol-Javob" :bordered="false" size="medium" role="dialog" aria-modal="true" closable
                @close="showClose('update')">
                <ModelForm @close="closeUpdate"  type="update" :id="updateId" @update="updateModel" />
            </n-card>
        </n-modal>
    </section>
    <!-- create more  -->
    
</template>