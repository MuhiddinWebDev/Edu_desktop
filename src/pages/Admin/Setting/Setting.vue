<script setup>
import { h, ref, onMounted, inject } from "vue";
import ModelService from "../../../services/site.service";
import { NButton, NIcon, useMessage, useDialog, NImage } from 'naive-ui';
import ModelForm from "./SettingForm.vue";
import {
    Add20Filled as AddIcon,
    AddSquareMultiple16Regular as AddsIcon
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
const img_url = inject('site_img');
const getAll = () => {
    ModelService.getAll().then((res) => {
        res.forEach((item) => {
            data.value.push(item);
        })
    })
}

const data = ref([]);
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
        title: 'Rasm',
        key: 'image',
        resizable: true,
        render(row){
            if(row.image != ''){
                return h(
                    NImage,
                    {
                        width: 100,
                        height: 70,
                        src: img_url + row.image
                    }
                )
            }else{
                return "Rasm yo'q"
            }
        }
    },
    {
        title: 'Sarlovha',
        key: 'title',
        resizable: true,

    },
    {
        title: 'Matn',
        key: 'text',
        resizable: true,
    },
    {
        title: 'Qator',
        key: 'row',
        resizable: true,
        sortOrder: true,
        sorter(rowA, rowB) {
            return rowA.row - rowB.row;
        }

    },
    {
        title: 'Izoh',
        key: "comment",
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
/////  create and update functions
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
////////////////////////////////
</script>
<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-header">
                <div class="box-header_item">
                    <h2>Sayt sozlamalari</h2>
                </div>
                <div class="box-header_item">
                    <n-button @click="showCreate = true" type="success">
                        <template #icon>
                            <n-icon size="18">
                                <AddIcon />
                            </n-icon>
                        </template>
                        Qo'shish
                    </n-button>
                   
                </div>
            </div>

        </div>
        <div class="box-table">
            <n-data-table :columns="columns" :data="data" :bordered="true" max-height="calc(100vh - 300px)" >
            </n-data-table>
        </div>
    </div>
    <!-- Modal create and Update -->
    <section>
        <n-modal transform-orign="center" v-model:show="showCreate" :mask-closable="false">
            <n-card
                style="max-width: 800px; max-height:900px;overflow: hidden;overflow-y: auto;"
                title="Sozlama qo'shish" :bordered="false" size="large" role="dialog" aria-modal="true" closable
                @close="showClose('create')">
                <ModelForm @close="closeCreate" @create="createModel" type="create" />
            </n-card>
        </n-modal>
        <n-modal transform-orign="center" v-model:show="showUpdate" :mask-closable="false">
            <n-card
                style="max-width: 800px; max-height:900px;overflow: hidden;overflow-y: auto;"
                title="Sozlama qo'shish" :bordered="false" size="large" role="dialog" aria-modal="true" closable
                @close="showClose('update')">
                <ModelForm @close="closeUpdate"  type="update" :id="updateId" @update="updateModel" />
            </n-card>
        </n-modal>
        <!-- create more  -->
    </section>
</template>