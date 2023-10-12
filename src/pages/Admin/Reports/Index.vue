<script setup>
import { ref } from 'vue';
import { useRouter } from "vue-router";
import { AppsList24Filled as spendIcon } from "@vicons/fluent";
const router = useRouter();

const rep_data = ref([
    {
        report:"",
        sverka:"Kassa sverka",
        title:"Kassa"
    },
    {
        report:"",
        sverka:"Xarajat sverka",
        title:"Xarajat"
    },
    {
        report:"O'qituvchi hisoboti",
        sverka:"O'qituvchi sverka",
        title:"O'qituvchi"
    },
    {
        report:"Talaba hisoboti",
        sverka:"Talaba sverka",
        title:"Talaba"
    },
    {
        report:"Kurs hisoboti",
        sverka:"Kurs sverka",
        title:"Kurs"
    },
    {
        report:"Davomat hisoboti",
        sverka:"Davomat sverka",
        title:"Davomat"
    },
    {
        report:"Dars hisoboti",
        sverka:"Dars sverka",
        title:"Dars"
    },
    
  
])
const clickRouter = (link)=>{
    router.push({name:link})
}
</script>

<template>
    <div class="box">
        <div class="box-wrapper">
            <n-grid cols="1 s:2 m:4" :x-gap="12" :y-gap="8" responsive="screen">
                <n-grid-item v-for="(item) in rep_data">
                    <div class="box-cards">
                        <div class="box-cards-header">
                            <h3>{{ item.title }}</h3>
                        </div>
                        <div class="box-cards-content">
                            <div v-if="item.report != ''" class="d-flex-row box-row" @click="clickRouter(item.report)">
                                <n-icon size="24">
                                    <spendIcon />
                                </n-icon>
                                <p >{{ item.report }}</p>
                            </div>
                            <div class="d-flex-row box-row" @click="clickRouter(item.sverka)">
                                <n-icon size="24">
                                    <spendIcon />
                                </n-icon>
                                <p >{{ item.sverka }}</p>
                            </div>
                        </div>
                    </div>
                </n-grid-item>
            </n-grid>
        </div>
    </div>
</template>

<style setup>
.d-flex-row{
    display: flex;
    align-items: center;
    gap: 4px;
}
.box-cards{
    height: 100%;
}
.box-row{
    cursor: pointer;
    padding: 4px 6px;
    border-radius: 7px;
    margin-top: 3px;
    transition: all 0.3s;
}
.box-row:hover{
    background: #ffffff10;
}
</style>
