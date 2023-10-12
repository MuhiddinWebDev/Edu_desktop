<script setup>
import {ref, onMounted, watch, computed} from "vue";
import { useMessage } from "naive-ui";
import ModelService from "../../services/contact.service";
import ContactService from "../../services/quiz.service";
import {useCounterStore} from '../../stores/counter.js'
const Counter = useCounterStore()
const formRef = ref('');
const spinBtn = ref(false);
const message = useMessage()
const form_data = ref({
    fullname:'',
    email:'',
    offer:'',
})
const rules = {
    fullname:{
        required: true,
        trigger:'blur',
        message:'Ismingizni kiriting'
    },
    email:{
        required: true,
        trigger:'blur',
        message:'Emailgizni kiriting'
    },
    offer:{
        required: true,
        trigger:'blur',
        message:'Taklifingizni kiriting'
    }
}

//// auto complete in the input
const emails = computed(()=>{
    return ["@gmail.com", "@163.com", "@qq.com"].map((suffix)=>{
        const prefix = form_data.value.email.split('@')[0];
        return{
            label:prefix + suffix,
            value:prefix + suffix
        }
    })
})

//////////////////////////////// 
const quiz = ref([])

const ClickItem = (e) => {
}
const sendMessage = async (e)=>{
    try{
        const result = await formRef.value?.validate();
        spinBtn.value = true
        ModelService.create(form_data.value).then((res)=>{
            message.success("Ma'lumotlar yuborildi")
            form_data.value.fullname = ''
            form_data.value.email = ''
            form_data.value.offer = ''
            setTimeout(()=> spinBtn.value = false, 500)
        }).catch((err)=>{
            message.error("Ma'lumotlar yuborilmadi")
            spinBtn.value = false
        })
    } catch(e) {
        console.log(e)
    }
}
//  tranlate
const row14Title = ref('');
const row14Text = ref('');
const row15Title = ref('');
const row15Text = ref('');
watch(() => {
    if (Counter.itemsTranslate != "") {
        row14Title.value = Counter.itemsTranslate.datarow14[0].title;
        row14Text.value = Counter.itemsTranslate.datarow14[0].text;
        row15Title.value = Counter.itemsTranslate.datarow15[0].title;
        row15Text.value = Counter.itemsTranslate.datarow15[0].text;
    }
})
onMounted(()=>{
    ContactService.getAll().then((res)=>{
        quiz.value = res
    })
})
</script>

<template>
    <div class="main-connect">
        <div class="main-connect-header">
            <h1 class="text-bold">{{ row14Title }}</h1>
            <p>{{ row14Text }}</p>
        </div>
        <div class="main-connect-box">
            <div class="main-connect-box_item">
                <h1 class="text-bold">Tez-tez so'raladigan savollar</h1>
                <n-collapse @item-header-click="ClickItem" accordion>
                    <n-scrollbar style="max-height: 620px; padding:0px 8px ;" trigger="hover">
                        <n-collapse-item :style="{padding:'8px 12px'}" v-for="(item, index) in quiz" class="collapsed"  :title="item.question_uz"
                            :name="index+1">
                            <div>{{item.answer_uz}}</div>
                        </n-collapse-item>
                    </n-scrollbar>
                </n-collapse>
            </div>
            <div class="main-connect-box_item">
                <n-spin :show="spinBtn">
                    <n-card>
                        <h1 class="text-bold">{{ row15Title }}</h1>
                        <p>{{ row15Text }}</p>
                        <br>
                        <n-form ref="formRef" :model="form_data" :rules="rules">
                            <n-form-item label="Ismingiz" path="fullname">
                                <n-input v-model:value="form_data.fullname" ></n-input>
                            </n-form-item>
                            <n-form-item label="Email manzilingiz" path="email">
                                <n-auto-complete 
                                v-model:value="form_data.email"
                                :input-props="{autocomplete: 'disabled'}"
                                :options="emails"/>
                            </n-form-item>
                            <n-form-item label="Taklifingiz" path="email">
                                <n-input show-count  type="textarea" v-model:value="form_data.offer"></n-input>
                            </n-form-item>
                            <n-button type="success" @click="sendMessage">Yuborish</n-button>
                        </n-form>
                    </n-card>
                </n-spin>
            </div>
        </div>
    </div>
</template>

<style scoped>
.collapsed {
    background: #fff;
    border-radius: 6px;
    padding: 8px 12px;
    margin: 8px 0px;
    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
}
</style>