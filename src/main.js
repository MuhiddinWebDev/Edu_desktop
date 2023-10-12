import { createApp } from 'vue';
import { createPinia } from 'pinia';
import axios from 'axios'

import Provider from './components/Provider.vue';


import router from './router';
import naive from 'naive-ui';
import VWave from 'v-wave';
import Print from 'vue3-print-nb'

import './assets/style.scss';

import dayjs from 'dayjs' //import dayjs in your main.js
//// error messages in axios 


const app = createApp(Provider)
app.use(createPinia());

import { useErrorStore } from './stores/errors'
const error_store = useErrorStore()
/// style templates


////////////////////////////////
let BASE_URL = import.meta.env.VITE_BASE_URL;
axios.defaults.baseURL = BASE_URL
axios.interceptors.request.use(function (config) {
  // Do something before request is sent
  config.headers['Authorization'] = `Bearer ` + localStorage.getItem('token');
  if (!localStorage.getItem('leng')) {
    config.headers['Accept-Language'] = 'uz'
  } else {
    config.headers['Accept-Language'] = localStorage.getItem('leng')
  }
  config.headers['token'] = localStorage.getItem('clientToken');
  return config;
},
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  });

axios.interceptors.response.use(function (response) {
  // Any status code that lie within the range of 2xx cause this function to trigger
  // Do something with response data
  return response.data;
},
  function (error) {
    if (error.message == 'Network Error') {
      error_store.error_text = "Baza bilan aloqa uzildi!"
    }
    if (error.code == 'ERR_NETWORK') {
      router.push({ name: 'Login' });
      localStorage.clear();
    } else if (error.response.status == 400) {
      error_store.error_text = error.response.data.message
    } else if (error.response.status == 401) {
      error_store.error_text = error.response.data.message
      router.push({ name: 'Login' });
    } else if (error.response.status == 500) {
      error_store.error_text = error.response.data.message
    } else {
      error_store.error_text = error.message
    }
    return Promise.reject(error);
});

app.use(router)
app.use(naive)
app.use(Print)


app.use(VWave, {
  color: '#fff',
  initialOpacity: 0.5,
  duration: 0.5,
  easing: 'ease-in',
  cancellationPeriod: 100
})

app.provide('dayJS', dayjs);
app.provide('down_pdf', `${BASE_URL}`)
app.provide('img_url', `${BASE_URL}/uploads/user`)
app.provide('site_img', `${BASE_URL}/uploads/image/`)
app.provide('course_img', `${BASE_URL}/uploads/course/`)
app.provide('course_video', `${BASE_URL}/uploads/coursePlan/`)
app.mount('#app')
