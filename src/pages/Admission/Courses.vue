<script setup>
import { ref, watch} from "vue";
import { useRoute} from "vue-router";
import {
    DocumentBulletList24Regular as docIcon,
    Clock24Regular as clockIcon,
    ArrowTrendingLines24Filled as rateIcon,
} from "@vicons/fluent";
import { useCounterStore } from "../../stores/counter";

const Counter = useCounterStore()

const courses = ref([]);
const router = useRoute();
for (let i = 0; i < 20; i++) {
    courses.value.push({
        name: i
    })
}
const row6Title = ref('');
const row6Text = ref('');
watch(() => {
    if (Counter.itemsTranslate != "") {
        row6Title.value = Counter.itemsTranslate.datarow5[0].title;
        row6Text.value = Counter.itemsTranslate.datarow5[0].text;
    }
})
</script>

<template>
    <div :class="router.name =='main-courses' ? 'padding':''" >
        <div class="main-choose-card max-width-scroll">
            <div class="main-choose-card_title" style="text-align:center;margin-top:30px;">
                <h2>{{ row6Title }}</h2>
                <p>{{ row6Text }}</p>
            </div>
            <div class="main-choose-card-box">
                <n-tabs :tab-style="{ borderRadius: '25px' }" animated type="segment">
                    <n-tab-pane name="Barchasi" tab="Barchasi">
                        <div class="main-choose-card-tabs" >
                            <div class="main-choose-card-tabs_item" v-for="(item, index) in courses">
                                <n-card class="carded">
                                    <div class="main-choose-card-horizont">
                                        <div class="main-choose-card-horizont_item">
                                            <img src="../../assets/images/js_horizantal.svg" alt="">
                                        </div>
                                        <div class="main-choose-card-horizont_item">
                                            <n-button type="success">Front-End</n-button>
                                            <div class="main-choose-card-horizont_def">
                                                <p>JavaScript darslar to'liq kurs - "From 0 To Guru"</p>
                                            </div>
                                            <div class="main-choose-card-horizont_action">
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <docIcon />
                                                    </n-icon>
                                                    <p>31 darslar</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <clockIcon />
                                                    </n-icon>
                                                    <p>15 soat</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <rateIcon />
                                                    </n-icon>
                                                    <p>Boshlang'ich</p>
                                                </div>
    
                                            </div>
                                            <n-divider></n-divider>
                                            <div class="main-choose-card-horizont_footer">
                                                <div class="user-logo" style="justify-content:space-between;">
                                                    <div class="user-logo_item">
                                                        <img src="../../assets/images/user-me.jpg" alt="">
                                                        <p>Xazratqulov M.</p>
                                                    </div>
                                                    <div class="user-logo_item">
                                                        <p class="text-through text-bold">250.00UZS</p>
                                                        <p class="text-bold">Bepul</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </n-card>
                            </div>
                            
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="Boshlang'ich" tab="Boshlang'ich">
                        <div class="main-choose-card-tabs">
                            <div class="main-choose-card-tabs_item" v-for="(item, index) in courses">
                                <n-card class="carded">
                                    <div class="main-choose-card-horizont">
                                        <div class="main-choose-card-horizont_item">
                                            <img src="../../assets/images/js_horizantal.svg" alt="">
                                        </div>
                                        <div class="main-choose-card-horizont_item">
                                            <n-button type="success">Front-End</n-button>
                                            <div class="main-choose-card-horizont_def">
                                                <p>JavaScript darslar to'liq kurs - "From 0 To Guru"</p>
                                            </div>
                                            <div class="main-choose-card-horizont_action">
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <docIcon />
                                                    </n-icon>
                                                    <p>31 darslar</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <clockIcon />
                                                    </n-icon>
                                                    <p>15 soat</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <rateIcon />
                                                    </n-icon>
                                                    <p>Boshlang'ich</p>
                                                </div>
    
                                            </div>
                                            <n-divider></n-divider>
                                            <div class="main-choose-card-horizont_footer">
                                                <div class="user-logo" style="justify-content:space-between;">
                                                    <div class="user-logo_item">
                                                        <img src="../../assets/images/user-me.jpg" alt="">
                                                        <p>Xazratqulov M.</p>
                                                    </div>
                                                    <div class="user-logo_item">
                                                        <p class="text-through text-bold">250.00UZS</p>
                                                        <p class="text-bold">Bepul</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </n-card>
                            </div>
                           
                        </div>
    
                    </n-tab-pane>
                    <n-tab-pane name="O'rta" tab="O'rta">
                        <div class="main-choose-card-tabs">
                            <div class="main-choose-card-tabs_item" v-for="(item, index) in courses">
                                <n-card class="carded">
                                    <div class="main-choose-card-horizont">
                                        <div class="main-choose-card-horizont_item">
                                            <img src="../../assets/images/js_horizantal.svg" alt="">
                                        </div>
                                        <div class="main-choose-card-horizont_item">
                                            <n-button type="success">Front-End</n-button>
                                            <div class="main-choose-card-horizont_def">
                                                <p>JavaScript darslar to'liq kurs - "From 0 To Guru"</p>
                                            </div>
                                            <div class="main-choose-card-horizont_action">
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <docIcon />
                                                    </n-icon>
                                                    <p>31 darslar</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <clockIcon />
                                                    </n-icon>
                                                    <p>15 soat</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <rateIcon />
                                                    </n-icon>
                                                    <p>Boshlang'ich</p>
                                                </div>
    
                                            </div>
                                            <n-divider></n-divider>
                                            <div class="main-choose-card-horizont_footer">
                                                <div class="user-logo" style="justify-content:space-between;">
                                                    <div class="user-logo_item">
                                                        <img src="../../assets/images/user-me.jpg" alt="">
                                                        <p>Xazratqulov M.</p>
                                                    </div>
                                                    <div class="user-logo_item">
                                                        <p class="text-through text-bold">250.00UZS</p>
                                                        <p class="text-bold">Bepul</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </n-card>
                            </div>
                        </div>
                    </n-tab-pane>
                    <n-tab-pane name="Murakkab" tab="Murakkab">
                        <div class="main-choose-card-tabs">
                            <div class="main-choose-card-tabs_item" v-for="(item, index) in courses">
                                <n-card class="carded">
                                    <div class="main-choose-card-horizont">
                                        <div class="main-choose-card-horizont_item">
                                            <img src="../../assets/images/js_horizantal.svg" alt="">
                                        </div>
                                        <div class="main-choose-card-horizont_item">
                                            <n-button type="success">Front-End</n-button>
                                            <div class="main-choose-card-horizont_def">
                                                <p>JavaScript darslar to'liq kurs - "From 0 To Guru"</p>
                                            </div>
                                            <div class="main-choose-card-horizont_action">
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <docIcon />
                                                    </n-icon>
                                                    <p>31 darslar</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <clockIcon />
                                                    </n-icon>
                                                    <p>15 soat</p>
                                                </div>
                                                <div class="main-choose-card-horizont_action__item">
                                                    <n-icon size="24">
                                                        <rateIcon />
                                                    </n-icon>
                                                    <p>Boshlang'ich</p>
                                                </div>
    
                                            </div>
                                            <n-divider></n-divider>
                                            <div class="main-choose-card-horizont_footer">
                                                <div class="user-logo" style="justify-content:space-between;">
                                                    <div class="user-logo_item">
                                                        <img src="../../assets/images/user-me.jpg" alt="">
                                                        <p>Xazratqulov M.</p>
                                                    </div>
                                                    <div class="user-logo_item">
                                                        <p class="text-through text-bold">250.00UZS</p>
                                                        <p class="text-bold">Bepul</p>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </n-card>
                            </div>
                        </div>
    
                    </n-tab-pane>
                </n-tabs>
            </div>
        </div>
    </div>
</template>
<style scoped>

.padding{
    margin-top: 1vh;
    place-items: initial;
    padding: 12px calc(8% - 50px);
}
</style>