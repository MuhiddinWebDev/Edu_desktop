<script setup>
import { ref, watch, onMounted, defineEmits } from "vue";
import { useRoute, useRouter } from "vue-router";
import Home from "./Home.vue";

import ModelService from "../../services/site.service";
import TanslateService from "../../services/translate.service.js";

import Loading from "../../components/Animation/Loading/Load.vue"
import {
    HatGraduation24Filled as HatIcon,
    LineHorizontal320Filled as threelineIcon,
} from "@vicons/fluent";
import { EnterOutline as EnterIcon } from "@vicons/ionicons5";
import { useCounterStore } from "../../stores/counter";

///// Animation loading function
const showLoading = ref(false);
setTimeout(() => {
    showLoading.value = false;
}, 600);
const Counter = useCounterStore()
const sidebar = ref(false);
const route = useRoute()
const router = useRouter()
const header_fixed = ref(false);
const count1 = ref(0);
const count2 = ref(0);
const ScrollValue = ref(null);
const langId = ref('uz')
const RunScroll = (e) => {
    let xy = ref(ScrollValue.value.scrollTop)
    count2.value = count1.value;
    count1.value = xy.value;
    if (xy.value < 80) {
        header_fixed.value = false;
    } else if (count2.value > count1.value) {
        header_fixed.value = true;
    }
    else {
        header_fixed.value = false;
    }
}
const langOption = [
    {
        label: "uz",
        value: "uz"
    },
    {
        label: "ru",
        value: "ru"
    },
]
const eduTitle = ref('')
const boshTitle = ref('')
const kursTitle = ref('')
const bogTitle = ref('')
const kirishTitle = ref('')
const langUpdate = (e) => {
    localStorage.setItem('leng', e);
    langId.value = e;
    ModelService.getAll(e).then((res) => {
    })
    TanslateService.getAll().then((res) => {
        Counter.itemsTranslate = res;
        eduTitle.value = res.datarow1[0].title
        boshTitle.value = res.datarow1[1].title
        kursTitle.value = res.datarow1[2].title
        bogTitle.value = res.datarow1[3].title
        kirishTitle.value = res.datarow1[4].title
    })
}

const comeData = ref([]);
onMounted(() => {

    TanslateService.getAll().then((res) => {
        Counter.itemsTranslate = res;
        eduTitle.value = res.datarow1[0].title
        boshTitle.value = res.datarow1[1].title
        kursTitle.value = res.datarow1[2].title
        bogTitle.value = res.datarow1[3].title
        kirishTitle.value = res.datarow1[4].title
    })
    ModelService.getAll(langId.value).then((res) => {
        res.forEach((item) => {
            comeData.value.push(item)
        })
    })
})

//////////////////////////////// end function
//////// enter to user panel
const EnterTo = ()=>{
    // @click="router.push({ name: 'Login' })"
    let getUserRole = localStorage.getItem('role');
    let getUserToken = localStorage.getItem('token');
    router.push({ name: 'Login'});
}
//////////////////////////////// end function
</script>
<template>
    <div @scroll="RunScroll" ref="ScrollValue" class="bg-color">
        <div class="main">
            <div class="main-header" :class="header_fixed ? 'main-header_active' : ''">
                <div class="main-header_item">
                    <div class="main-logo">
                        <div class="main-logo_icon">
                            <n-icon size="28">
                                <HatIcon />
                            </n-icon>
                        </div>
                        <h2>
                            <h2 v-if="eduTitle == ''">Education</h2>
                            <h2 v-if="eduTitle != ''">{{ eduTitle }}</h2>
                        </h2>
                    </div>
                    <div class="main-header_router">
                        <div @click="router.push({ name: 'main-home' })" class="main-header_router__line">
                            <p>{{ boshTitle }}</p>
                            <span></span>
                        </div>
                        <div @click="router.push({ name: 'main-courses' })" class="main-header_router__line">
                            <p>{{ kursTitle }}</p>
                            <span></span>
                        </div>
                        <div @click="router.push({ name: 'main-connect' })" class="main-header_router__line">
                            <p>{{ bogTitle }}</p>
                            <span></span>
                        </div>
                    </div>
                </div>
                <div class="main-header_item">
                    <n-button @click="EnterTo" type="success"
                        :style="{ borderRadius: '7px', padding: '12px 25px' }">
                        <h3>{{ kirishTitle }}</h3>
                    </n-button>
                    <div class="main-header_item">
                        <n-popselect @update-value="langUpdate" v-model:value="langId" :options="langOption" size="small">
                            <n-button type="success">
                                {{ langId }}
                            </n-button>
                        </n-popselect>
                    </div>
                </div>
                <div class="main-header_item">
                    <n-button type="success" @click="sidebar = true">
                        <n-icon size="24">
                            <threelineIcon />
                        </n-icon>
                    </n-button>
                </div>

            </div>
        </div>
        <Home v-if="route.name == 'Addmissions'" />
        <router-view></router-view>
        <!-- Sidebar for phone version -->
        <section>
            <n-drawer v-model:show="sidebar" placement="left"
                :style="{ width: 'calc(100vw - 120px)', minWidth: '300px', height: '100vh' }">
                <n-drawer-content :style="{ padding: '10px 0px !important' }" closable>
                    <template #header>
                        <div class="main-logo">
                            <div class="main-logo_icon">
                                <n-icon size="28">
                                    <HatIcon />
                                </n-icon>
                            </div>
                            <h2>Education</h2>
                        </div>
                    </template>
                    <div class="sidebar-phone" @click="sidebar = false">
                        <p @click="router.push({ name: 'main-home' })" class="text-bold">Bosh sahifa</p>
                        <n-divider></n-divider>
                        <p @click="router.push({ name: 'main-courses' })" class="text-bold">Kurslar</p>
                        <n-divider></n-divider>
                        <p @click="router.push({ name: 'main-connect' })" class="text-bold">Bog'lanish</p>
                        <n-divider></n-divider>
                        <p @click="router.push({ name: 'Login' })" id="enter" class="text-bold"> <n-icon size="20">
                                <EnterIcon></EnterIcon>
                            </n-icon> Dasturga kirish</p>
                        <n-divider></n-divider>
                    </div>
                </n-drawer-content>
            </n-drawer>
        </section>
    </div>
    <!-- Animation loading -->
    <section>
        <n-modal v-model:show="showLoading">
            <Loading/>
        </n-modal>
    </section>
</template>

<style scoped>


#enter {
    display: flex;
    align-items: center;
    gap: 8px;
}
</style>