<script setup>
import { h, ref, onMounted } from "vue";
import ModelService from "../../../services/contact.service";
import MessageModal from './Form.vue';
import { NButton, NIcon, useMessage, useDialog } from 'naive-ui';
import { RemoveRedEyeRound as showIcon } from "@vicons/material"
import {
    TrashCan as TrashIcon,
    Pen as PenICon
} from "@vicons/carbon";

const message = useMessage();
const dialog = useDialog();
const showCreate = ref(false);
const showUpdate = ref(false);
const showMessage = ref(false);
const messageId = ref(null);
const updateId = ref(null);
const loading = ref(true);
const UserOptions = ref([]);
const UserId = ref(null);
const getAll = () => {
    ModelService.getAll().then((res) => {
        data.value = res;
        loading.value = false;
        UserOptions.value = res;
    })
}

const data = ref([]);
const columns = ref([
    {
        title: '№',
        key: 'index',
        width: 50,
        render(row) {
            return data.value.findIndex((item) => item.id == row.id) + 1;
        }
    },
    {
        title: 'Ismi',
        key: 'fullname',
        resizable: true,
    },
    {
        title: 'Pochta manzil',
        key: 'email',
        resizable: true,

    },
    {
        title: 'Taklifi',
        key: 'showoffer',
        resizable: true,
        width: 180,
        render(row) {
            return [
                h(
                    NButton,
                    {
                        size: 'small',
                        type: 'success',
                        block: true,
                        onClick: (e) => {
                            showMessage.value = true;
                            messageId.value = row.id
                        }
                    },
                    {
                        icon: () =>
                            h(NIcon, {
                                component: showIcon,
                                size: 16
                            }),
                        default: () => {
                            return "Taklif"
                        }
                    },
                ),
            ]
        }
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

const showClose = (e) => {
    if (e == 'create') {
        showCreate.value = false;
    } else if (e == 'update') {
        showUpdate.value = false;
    } else if (e == 'offer') {
        showMessage.value = false;
    }
}

//// show messages 
const closeOffer = () => {
    showMessage.value = false;
}
////////////////////////////////
//// search user functions
const searchUser = ()=>{
    if(UserId.value != null){
        loading.value = true;
        ModelService.searchModel(UserId.value).then((res) => {
            console.log(res)
            data.value = res;
            loading.value = false;
        });
    }else{
        getAll()
    }
}
//// search user functions end

</script>
<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-header">
                <div class="box-header_item">
                    <h2>Xabarlar</h2>
                </div>
            </div>
            <div class="search-action">
                <div class="search-action_item">
                    <n-input-group>
                        <n-input-group-label>Foydalanuvchi</n-input-group-label>
                        <n-select v-model:value="UserId" placeholder="Qidiruv"  clearable filterable
                            :options="UserOptions" label-field="fullname" value-field="id"></n-select>
                    </n-input-group>
                </div>
                <div class="search-action_item">
                    <n-button @click="searchUser" type="success">Ko'rish</n-button>
                </div>
            </div>
        </div>
        <div class="box-table">
            <n-data-table :loading="loading" :columns="columns" :data="data" :bordered="true"
                style="min-width: 700px;overflow: auto;" max-height="calc(100vh - 300px)">
            </n-data-table>
        </div>
    </div>
    <!-- Modal create and Update -->
    <!-- <section>
            <n-modal v-model:show="showCreate" :mask-closable="false">
                <n-card
                    style="max-width: 800px;height: calc(100vh - 25px); max-height:900px;overflow: hidden;overflow-y: auto;"
                    title="Sozlama qo'shish" :bordered="false" size="large" role="dialog" aria-modal="true" closable
                    @close="showClose('create')">
                    <ModelForm @close="closeCreate" @create="createModel" type="create" />
                </n-card>
            </n-modal>
            <n-modal v-model:show="showUpdate" :mask-closable="false">
                <n-card
                    style="max-width: 800px;height: calc(100vh - 25px); max-height:900px;overflow: hidden;overflow-y: auto;"
                    title="Sozlama qo'shish" :bordered="false" size="large" role="dialog" aria-modal="true" closable
                    @close="showClose('update')">
                    <ModelForm @close="closeUpdate"  type="update" :id="updateId" @update="updateModel" />
                </n-card>
            </n-modal>
        </section> -->
    <!-- create more  -->
    <!-- Show messages -->
    <section>
        <n-modal v-model:show="showMessage">
            <n-card style="max-width: 800px;max-height:800px;" title="Taklifi" :bordered="false" size="large" role="dialog"
                aria-modal="true" closable @close="showClose('offer')">
                <MessageModal @close="closeOffer" type="update" :id="messageId" />
            </n-card>
        </n-modal>
    </section>
</template>