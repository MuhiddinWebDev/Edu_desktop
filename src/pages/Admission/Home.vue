<script setup>
import { watchEffect, ref } from 'vue'
import CoursesVue from "./Courses.vue";
import {
    HatGraduation24Filled as HatIcon,
    PlayCircle28Filled as playIcon,
    Laptop28Regular as laptopIcon,
    BookOpenGlobe24Filled as globeIcon,
    PeopleAudience24Regular as audienceIcon,
    Key32Regular as KeyIcon,
    DocumentBulletList24Regular as docIcon,
    Clock24Regular as clockIcon,
    ArrowTrendingLines24Filled as rateIcon,
    SwipeRight24Regular as rightArrowIcon,
    Checkmark24Filled as CheckBoldIcon,
    Person48Filled as person48Icon,
    Person24Regular as createrIcon,
} from "@vicons/fluent";
import { useCounterStore } from "../../stores/counter";
import { useRouter } from "vue-router";

const Counter = useCounterStore()
const router = useRouter();
const titleTranlate = ref('');
const titleText = ref('');
const eduTitle = ref('');
const card1Title = ref('');
const card1Text = ref('');
const card2Title = ref('');
const card2Text = ref('');
const card3Title = ref('');
const card3Text = ref('');
const card4Title = ref('');
const card4Text = ref('');
const row5Title = ref('');
const row5Text = ref('');
const row7Title = ref('');
const row7Text = ref('');
const card2Title1 = ref('');
const card2Text1 = ref('');
const card2Title2 = ref('');
const card2Text2 = ref('');
const card2Title3 = ref('');
const card2Text3 = ref('');
const card2Title4 = ref('');
const card2Text4 = ref('');
const row8Title = ref('');
const row8Text = ref('');
const card3Title1 = ref('');
const card3Text1 = ref('');
const card3Title2 = ref('');
const card3Text2 = ref('');
const card3Title3 = ref('');
const card3Text3 = ref('');
const row11Title = ref("")
const row11Text = ref("")
const row12Title = ref("")
const row12Text = ref("")
const row12Title2 = ref("")
const row12Text2 = ref("")

watchEffect(() => {
    if (Counter.itemsTranslate != "") {
        titleTranlate.value = Counter.itemsTranslate.datarow2[0].title;
        titleText.value = Counter.itemsTranslate.datarow2[0].text;
        eduTitle.value = Counter.itemsTranslate.datarow3[0].title;
        card1Title.value = Counter.itemsTranslate.datarow4[0].title;
        card1Text.value = Counter.itemsTranslate.datarow4[0].text;
        card2Title.value = Counter.itemsTranslate.datarow4[1].title;
        card2Text.value = Counter.itemsTranslate.datarow4[1].text;
        card3Title.value = Counter.itemsTranslate.datarow4[2].title;
        card3Text.value = Counter.itemsTranslate.datarow4[2].text;
        card4Title.value = Counter.itemsTranslate.datarow4[3].title;
        card4Text.value = Counter.itemsTranslate.datarow4[3].text;
        row5Title.value = Counter.itemsTranslate.datarow4[0].title;
        row5Text.value = Counter.itemsTranslate.datarow4[0].text;
        row7Title.value = Counter.itemsTranslate.datarow6[0].title;
        row7Text.value = Counter.itemsTranslate.datarow6[0].text;
        card2Title1.value = Counter.itemsTranslate.datarow7[0].title;
        card2Text1.value = Counter.itemsTranslate.datarow7[0].text;
        card2Title2.value = Counter.itemsTranslate.datarow8[1].title;
        card2Text2.value = Counter.itemsTranslate.datarow8[1].text;
        card2Title3.value = Counter.itemsTranslate.datarow8[2].title;
        card2Text3.value = Counter.itemsTranslate.datarow8[2].text;
        card2Title4.value = Counter.itemsTranslate.datarow8[3].title;
        card2Text4.value = Counter.itemsTranslate.datarow8[3].text;
        row8Title.value = Counter.itemsTranslate.datarow9[0].title;
        row8Text.value = Counter.itemsTranslate.datarow9[0].text;
        card3Title1.value = Counter.itemsTranslate.datarow10[0].title;
        card3Text1.value = Counter.itemsTranslate.datarow10[0].text;
        card3Title2.value = Counter.itemsTranslate.datarow10[1].title;
        card3Text2.value = Counter.itemsTranslate.datarow10[1].text;
        card3Title3.value = Counter.itemsTranslate.datarow10[2].title;
        card3Text3.value = Counter.itemsTranslate.datarow10[2].text;
        row11Title.value = Counter.itemsTranslate.datarow11[0].title;
        row11Text.value = Counter.itemsTranslate.datarow11[0].text;
        row12Title.value = Counter.itemsTranslate.datarow12[0].title;
        row12Text.value = Counter.itemsTranslate.datarow12[0].text;
        row12Title2.value = Counter.itemsTranslate.datarow12[1].title;
        row12Text2.value = Counter.itemsTranslate.datarow12[1].text;
    }
})
</script>
<template>
    <section>
        <div class="main-box">
            <div class="main-content">
                <div class="main-content_item">
                    <div class="main-content_comment">
                        <h2 v-bind:innerHTML="titleTranlate">
                        </h2>
                        <n-button @click="$router.push({name:'Login'})" type="primary" :style="{ padding: '20px 40px' }">Boshlash</n-button>
                        <div class="edu-report">
                            <div class="edu-report_item">
                                <img src="../../assets/images/edu.svg" alt="edu-icon">
                                <p>Onlayn ta'lim</p>
                            </div>
                            <div class="edu-report_item">
                                <n-icon size="28">
                                    <HatIcon />
                                </n-icon>
                                <p>2 mingdan ortiq talaba</p>
                            </div>
                            <div class="edu-report_item">
                                <n-icon size="28">
                                    <playIcon />
                                </n-icon>
                                <p>To'liq kurslar</p>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="main-content_item max-width-responsive">
                    <img src="../../assets/images/map.svg" alt="">
                </div>
            </div>
        </div>
    </section>
    <div class="main-choose">
        <div class="main-choose-box">
            <div class="main-choose_header">
                <div class="main-choose_title">
                    <h2>{{ eduTitle }}.</h2>
                    <p>
                        {{ titleText }}
                    </p>
                </div>
            </div>
            <div class="main-choose-card">
                <div class="main-choose-card-box">
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="60">
                                        <laptopIcon />
                                    </n-icon>
                                </div>
                                <b>{{ card1Title }}</b>
                                <p>{{ card1Text }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="60">
                                        <globeIcon />
                                    </n-icon>
                                </div>
                                <b>{{ card2Title }}</b>
                                <p>{{ card2Text }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="60">
                                        <audienceIcon />
                                    </n-icon>
                                </div>
                                <b>{{  card3Title}}</b>
                                <p>{{ card3Text }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="60">
                                        <KeyIcon />
                                    </n-icon>
                                </div>
                                <b>{{ card4Title }}</b>
                                <p>{{ card4Text }}</p>
                            </div>
                        </n-card>
                    </div>
                </div>
            </div>
            <div class="main-choose-card">
                <div class="main-choose-card_title">
                    <h2>{{ row5Title }}</h2>
                    <p>{{ row5Text }}</p>
                </div>
                <div class="main-choose-card-box">
                    <div class="main-choose-card_item">
                        <n-card class="carded">
                            <template #cover>
                                <img src="../../assets/images/htmlCss.svg">
                            </template>
                            <div class="main-choose-card_text">
                                <p>Foundation darslari <span></span></p>
                            </div>
                            <div class="main-choose-menu">
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <docIcon />
                                    </n-icon>
                                    <p>31 darslar</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <clockIcon />
                                    </n-icon>
                                    <p>15 soat</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <rateIcon />
                                    </n-icon>
                                    <p>Boshlang'ich</p>
                                </div>
                            </div>
                            <div class="main-choose-menu">
                                <p class="line-through">150.000UZS</p>
                                <p class="text-bold">Bepul</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded">
                            <template #cover>
                                <img src="../../assets/images/Express.svg">
                            </template>
                            <div class="main-choose-card_text">
                                <p>ExpressJS darslari to'liq kurs <span></span></p>
                            </div>
                            <div class="main-choose-menu">
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <docIcon />
                                    </n-icon>
                                    <p>31 darslar</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <clockIcon />
                                    </n-icon>
                                    <p>15 soat</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <rateIcon />
                                    </n-icon>
                                    <p>Boshlang'ich</p>
                                </div>
                            </div>
                            <div class="main-choose-menu">
                                <p class="line-through">150.000UZS</p>
                                <p class="text-bold">Bepul</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded">
                            <template #cover>
                                <img src="../../assets/images/nodejs.svg">
                            </template>
                            <div class="main-choose-card_text">
                                <p>NodeJS darslari to'liq kurs<span></span></p>
                            </div>
                            <div class="main-choose-menu">
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <docIcon />
                                    </n-icon>
                                    <p>31 darslar</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <clockIcon />
                                    </n-icon>
                                    <p>15 soat</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <rateIcon />
                                    </n-icon>
                                    <p>Boshlang'ich</p>
                                </div>
                            </div>
                            <div class="main-choose-menu">
                                <p class="line-through">150.000UZS</p>
                                <p class="text-bold">Bepul</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded">
                            <template #cover>
                                <img src="../../assets/images/threejs.svg">

                            </template>
                            <div class="main-choose-card_text">
                                <p>TensorflowJS to'liq kurs<span></span></p>
                            </div>
                            <div class="main-choose-menu">
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <docIcon />
                                    </n-icon>
                                    <p>31 darslar</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <clockIcon />
                                    </n-icon>
                                    <p>15 soat</p>
                                </div>
                                <div class="main-choose-menu_item">
                                    <n-icon size="24">
                                        <rateIcon />
                                    </n-icon>
                                    <p>Boshlang'ich</p>
                                </div>
                            </div>
                            <div class="main-choose-menu">
                                <p class="line-through">150.000UZS</p>
                                <p class="text-bold">Bepul</p>
                            </div>
                        </n-card>
                    </div>
                </div>
            </div>
            <CoursesVue />
            <div class="main-choose-card">
                <div class="main-choose-card_title" style="text-align:center;margin-top:30px;">
                    <h2>{{ row7Title }}</h2>
                    <p>{{ row7Text }}</p>
                </div>
                <div class="main-choose-card-box d-flex-five box-shadow-no">
                    <div class="main-choose-card_item">
                        <n-card class="carded" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="40">
                                        <laptopIcon />
                                    </n-icon>
                                </div>
                                <h2>{{ card2Title1 }}</h2>
                                <p>{{ card2Text1 }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="40">
                                        <globeIcon />
                                    </n-icon>
                                </div>
                                <h2>{{ card2Title2 }}</h2>
                                <p>{{ card2Text2 }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="40">
                                        <audienceIcon />
                                    </n-icon>
                                </div>
                                <h2>{{ card2Title3 }}</h2>
                                <p>{{ card2Text3 }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="40">
                                        <KeyIcon />
                                    </n-icon>
                                </div>
                                <h2>{{ card2Title4 }}</h2>
                                <p>{{ card2Text4 }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <n-icon size="40">
                                        <KeyIcon />
                                    </n-icon>
                                </div>
                                <h2>Verstka</h2>
                                <p>Veb sahifalarni dizayn qismi</p>
                            </div>
                        </n-card>
                    </div>
                </div>
            </div>
            <div class="main-choose-card">
                <div class="main-choose-card_title" style="text-align:center;margin-top:30px;">
                    <h2>{{ row8Title }}</h2>
                    <p>{{ row8Text }}</p>
                </div>
                <div class="main-choose-card-box circle-wrapper d-flex-five  box-shadow-no" style="align-items:center;">
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <div class="card-circle_top">
                                        <n-icon size="20">
                                            <CheckBoldIcon />
                                        </n-icon>
                                    </div>
                                    <n-icon size="60">
                                        <globeIcon />
                                    </n-icon>
                                </div>
                                <p>
                                    {{ card3Title1 }}
                                </p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item d-flex-center">
                        <n-icon size="64">
                            <rightArrowIcon />
                        </n-icon>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">
                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <div class="card-circle_top">
                                        02
                                    </div>
                                    <n-icon size="60">
                                        <KeyIcon />
                                    </n-icon>
                                </div>
                                <p>{{ card3Title2 }}</p>
                            </div>
                        </n-card>
                    </div>
                    <div class="main-choose-card_item d-flex-center">
                        <n-icon size="64">
                            <rightArrowIcon />
                        </n-icon>
                    </div>
                    <div class="main-choose-card_item">
                        <n-card class="carded" :bordered="false" :content-style="{ padding: '18px 5px' }"
                            :style="{ borderRadius: '8px' }">

                            <div class="card-circle">
                                <div class="card-circle_item">
                                    <div class="card-circle_top">
                                        03
                                    </div>
                                    <n-icon size="60">
                                        <KeyIcon />
                                    </n-icon>
                                </div>
                                <p>
                                    {{ card3Title3 }}
                                </p>
                            </div>
                        </n-card>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <div class="main-footer">
        <div class="main-footer-box">
            <div class="main-footer-box_item">
                <h1 class="text-bold">{{ row11Title }}</h1>
                <p>{{ row11Text }}</p>
                <div class="main-footer-summery">
                    <div class="main-footer-summery_item">
                        <h1 class="text-bold">{{ row12Title }}</h1>
                        <p>{{ row12Text }}</p>
                    </div>
                    <div class="main-footer-summery_item">
                        <h1 class="text-bold">{{ row12Title2 }}</h1>
                        <p>{{ row12Text2 }}</p>
                    </div>
                </div>
            </div>
            <div class="main-footer-box_item">
                <div class="main-footer-box_slider">
                    <n-carousel :space-between="20" draggable dot-type="line" effect="custom"
                        :transition-props="{ name: 'creative' }" show-arrow style="max-width: 800px; height: 360px;">
                        <n-card title="VueJS- 'From 0 To Guru'">
                            "VueJS va VueX o'zbek sigmentida bunday kurslarni ko'rmagan edim, tog'risini aytaman kurs bu
                            darajada dep o'ylamagan edim. Boshida bepul ekan unchalik yaxshi bo'lmasa kerak dep o'yladim
                            ammo kursni ko'rib notog'ri fikrda ekanligimni bildim. Juda ham ajoyib kurs, Alloh sizdan
                            rozi bo'lsin Samaraka. Sammi platformasiga rivoj va yana yangilillarni kutib qolamiz"
                            <n-divider></n-divider>
                            <div class="main-footer-user">
                                <div class="main-footer-user_item ">

                                    <n-icon class="icon-gradient" size="48">
                                        <person48Icon />
                                    </n-icon>
                                </div>
                                <div class="main-footer-user_item">
                                    <h2>Rahmatilla Abdulloh</h2>
                                    <p>Talaba</p>
                                </div>
                            </div>

                        </n-card>
                        <n-card title="JavaScript - 'From 0 To Guru'">
                            "Samar aka kurslaringiz uchun kotta raxmat aytib qolaman, tog'risi bepul kurslar yordamida
                            shunchalik darajada JavaScript dasturlash tilini o'rganaman dep o'ylamagan edim. Darslardagi
                            ma'lumotlar va sifati juda ham alo. Pullik kurslarni o'rnini bemalol bossadi xattoki ayrim
                            pullik kurslardan ham o'tib tushadi. Sammi platformasi uchun kotta raxmat Alloh rozi bo'lsin
                            aka."
                            <n-divider></n-divider>
                            <div class="main-footer-user">
                                <div class="main-footer-user_item ">
                                    <n-icon class="icon-gradient" size="48">
                                        <person48Icon />
                                    </n-icon>
                                </div>
                                <div class="main-footer-user_item">
                                    <h2>Odilbek Rahimov</h2>
                                    <p>Talaba</p>
                                </div>
                            </div>

                        </n-card>
                        <n-card title="ReactJS - 'From 0 To Guru'">
                            "Assalamu Alaykum va rohmatulloh oka Alloh sizdan rozi bo'lsin shunday kurslarni bizga bepul
                            berayotganingiz uchun. Kursingiz alodan ham alo sababi u yerdagi darslarni ketma ketligi va
                            eng zo'ri esa nazariy va amaliy darslik sistemasi. Bitta darslikda nazariy boshqasida esa
                            amaliy. Hamma ITga qiziqadigon yosh dasturchilarga maslahat beraman."
                            <n-divider></n-divider>
                            <div class="main-footer-user">
                                <div class="main-footer-user_item ">
                                    <n-icon class="icon-gradient" size="48">
                                        <person48Icon />
                                    </n-icon>
                                </div>
                                <div class="main-footer-user_item">
                                    <h2>Abduazim Olimov</h2>
                                    <p>Talaba</p>
                                </div>
                            </div>

                        </n-card>
                    </n-carousel>
                </div>
            </div>
            <div class="main-footer-box_item">
                <div class="state">
                    <div class="state-header">
                        <h2 class="text-center">Biz haqimizda</h2>
                    </div>
                    <div class="state-body">
                        <div class="state-body-content">
                            <div class="state-body-content_item">
                                <n-icon size="24" color="#fff">
                                    <createrIcon></createrIcon>
                                </n-icon>
                                <p>Muallif</p>
                            </div>
                            <div class="state-body-content_item">
                                <p>Abdumalikov Dilshodjon</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <div class="main-footer-carusel">
        </div>
    </div>
</template>
<style scoped>
.text-center {
    text-align: center;
}
.state-body-content_item{
    display: flex;
    align-items: center;
    gap: 5px;
}
.state-body-content{
    display: flex;
    align-items: center;
    justify-content: space-between;
    font-size:14pt;
    font-weight: bold;
}
</style>