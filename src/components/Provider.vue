<script setup>
import { ref, onMounted} from 'vue';
import { useRouter } from "vue-router";
import App from '../App.vue'
import { darkTheme, lightTheme } from 'naive-ui'
import PaymentService from "../services/softwarePayment.service";

const themes = ref(lightTheme);
const router = useRouter();
const uzUz = {
  name: "uz-UZ",
  global: {
    undo: "Chiqish",
    redo: "Qayta qiling",
    confirm: "Tasdiqlash",
  },
  Popconfirm: {
    positiveText: "Tasdiqlash",
    negativeText: "Chiqish",
  },
  Cascader: {
    placeholder: "tanlang",
    loading: "Yuklanmoqda",
    loadingRequiredMessage: (label) =>
      `Belgilashdan oldin ${label} ning barcha ichki elementlarini tanlang.`,
  },
  Time: {
    dateFormat: "dd.MM.yyyy",
    dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
  },
  DatePicker: {
    yearFormat: "yyyy",
    monthFormat: "MM",
    dayFormat: "eeeeee",
    yearTypeFormat: "yyyy",
    monthTypeFormat: "yyyy-MM",
    dateFormat: "yyyy-MM-dd",
    dateTimeFormat: "dd.MM.yyyy HH:mm:ss",
    quarterFormat: "yyyy-qqq",
    clear: "Tozalash",
    now: "Hozir",
    confirm: "Tasdiqlash",
    selectTime: "Vaqtni tanlang",
    selectDate: "Sanani tanlang",
    datePlaceholder: "Sanani tanlang",
    datetimePlaceholder: "Sana va vaqtni tanlang",
    monthPlaceholder: "Oyni tanlang",
    yearPlaceholder: "Yilni tanlang",
    quarterPlaceholder: "Chorakni tanlang",
    startDatePlaceholder: "Boshlanish sanasi",
    endDatePlaceholder: "Tugash sanasi",
    startDatetimePlaceholder: "Boshlanish sanasi va vaqti",
    endDatetimePlaceholder: "Tugash sanasi va vaqti",
    monthBeforeYear: true,
    firstDayOfWeek: 6,
    today: "Bugun",
  },
  DataTable: {
    checkTableAll: "Jadvaldagi barchasini tanlash",
    uncheckTableAll: "Jadvaldagi barcha tanlovni olib tashlash",
    confirm: "Tasdiqlash",
    clear: "Tozalash",
  },
  Transfer: {
    sourceTitle: "Manba",
    targetTitle: "Maqsad",
  },
  Empty: {
    description: "Maʼlumot yoʻq",
  },
  Select: {
    placeholder: "Tanlang",
  },
  TimePicker: {
    placeholder: "Vaqtni tanlang",
    positiveText: "OK",
    negativeText: "Chiqish",
    now: "Hozir",
  },
  Pagination: {
    goto: "O'tish",
    selectionSuffix: "sahifa",
  },
  DynamicTags: {
    add: "Qo'shish",
  },
  Log: {
    loading: "Yuklanmoqda",
  },
  Input: {
    placeholder: "Kiriting",
  },
  InputNumber: {
    placeholder: "Kiriting",
  },
  DynamicInput: {
    create: "Yaratmoq",
  },
  ThemeEditor: {
    title: "Mavzu muharriri",
    clearAllVars: "Barcha o'zgaruvchilarni tozalash",
    clearSearch: "Qidiruvni tozalash",
    filterCompName: "Filtr komponenti nomi",
    filterVarName: "Filter Variable Name",
    import: "Import",
    export: "Export",
    restore: "Reset to Default",
  },
  // TODO: translation
  Image: {
    tipPrevious: "Oldingi rasm (←)",
    tipNext: "Keyingi rasm (→)",
    tipCounterclockwise: "Soat miliga teskari",
    tipClockwise: "Soat yo'nalishi bo'yicha",
    tipZoomOut: "Kichraytirish",
    tipZoomIn: "Kattalashtirish",
    tipClose: "Yopish (Esc)",
  },
};
const menuStyle ={
  common: {
    
      modalColor: '#fffefe',
      
    },
  Menu:{
    "borderRadius": "5px",
    "color": "#0c1e35",
    "groupTextColor": "#fff",
    "itemColorHover": "#cccccc15",
    "itemColorActive": "rgba(21, 230, 119, 0.8)",
    "itemColorActiveHover": "rgba(21, 230, 119, 0.8)",
    "itemColorActiveCollapsed": "rgba(14, 130, 69, 0.1)",
    "itemTextColor": "#fff",
    "itemTextColorHover": "#fff",
    "itemTextColorActive": "#fff",
    "itemTextColorActiveHover": "#fff",
    "itemTextColorChildActive": "#1AEB7DFF",
    "itemTextColorChildActiveHover": "#21E07BFF",
    "itemTextColorHorizontal": "rgba(56, 70, 84, 1)",
    "itemTextColorHoverHorizontal": "#22C66AFF",
    "itemTextColorActiveHorizontal": "#22DE7BFF",
    "itemTextColorActiveHoverHorizontal": "#0DDE70FF",
    "itemTextColorChildActiveHorizontal": "#0C914AFF",
    "itemTextColorChildActiveHoverHorizontal": "#33DD83FF",
    "itemIconColor": "#fff",
    "itemIconColorHover": "#fff",
    "itemIconColorActive": "#fff",
    "itemIconColorActiveHover": "#fff",
    "itemIconColorChildActive": "#1EDC77FF",
    "itemIconColorChildActiveHover": "#15CC6BFF",
    "itemIconColorCollapsed": "#fff",
    "itemIconColorHorizontal": "rgba(39, 125, 211, 1)",
    "itemIconColorHoverHorizontal": "#1EBE64FF",
    "itemIconColorActiveHorizontal": "#1DDA76FF",
    "itemIconColorActiveHoverHorizontal": "#4AE090FF",
    "itemIconColorChildActiveHorizontal": "#11CB68FF",
    "itemIconColorChildActiveHoverHorizontal": "#29DD7EFF",
    "itemHeight": "40px",
    "arrowColor": "#fff",
    "arrowColorHover": "#fff",
    "arrowColorActive": "#fff",
    "arrowColorActiveHover": "#fff",
    "arrowColorChildActive": "#fff",
    "arrowColorChildActiveHover": "#fff",
    "colorInverted": "#fff",
    "borderColorHorizontal": "#A7333300",
    "fontSize": "14px",
    "dividerColor": "#fff",
    "itemColorHoverInverted": "#fff",
    "itemColorActiveInverted": "#fff",
    "itemColorActiveHoverInverted": "#fff",
    "itemColorActiveCollapsedInverted": "#fff",
    "itemTextColorInverted": "#fff",
    "itemTextColorHoverInverted": "#fff",
    "itemTextColorChildActiveInverted": "#fff",
    "itemTextColorChildActiveHoverInverted": "#fff",
    "itemTextColorActiveInverted": "#fff",
    "itemTextColorActiveHoverInverted": "#fff",
    "itemTextColorHorizontalInverted": "#fff",
    "itemTextColorHoverHorizontalInverted": "#fff",
    "itemTextColorChildActiveHorizontalInverted": "#fff",
    "itemTextColorChildActiveHoverHorizontalInverted": "#fff",
    "itemTextColorActiveHorizontalInverted": "#fff",
    "itemTextColorActiveHoverHorizontalInverted": "#fff",
    "itemIconColorInverted": "#fff",
    "itemIconColorHoverInverted": "#fff",
    "itemIconColorActiveInverted": "#fff",
    "itemIconColorActiveHoverInverted": "#fff",
    "itemIconColorChildActiveInverted": "#fff",
    "itemIconColorChildActiveHoverInverted": "#fff",
    "itemIconColorCollapsedInverted": "#fff",
    "itemIconColorHorizontalInverted": "#fff",
    "itemIconColorHoverHorizontalInverted": "#fff",
    "itemIconColorActiveHorizontalInverted": "#fff",
    "itemIconColorActiveHoverHorizontalInverted": "#fff",
    "itemIconColorChildActiveHorizontalInverted": "#fff",
    "itemIconColorChildActiveHoverHorizontalInverted": "#fff",
    "arrowColorInverted": "#fff",
    "arrowColorHoverInverted": "#fff",
    "arrowColorActiveInverted": "#fff",
    "arrowColorActiveHoverInverted": "#fff",
    "arrowColorChildActiveInverted": "#fff",
    "arrowColorChildActiveHoverInverted": "#fff",
    "groupTextColorInverted": "#fff"
  },
  Drawer: {
    "textColor":  "rgba(255, 255, 255, 1)",
    "titleTextColor": "rgba(255, 255, 255, 1)",
    "headerPadding": "12px",
    "bodyPadding": "4px 6px"
  }
}
const action = ref(true);
const changeTheme = (e) => {
  if (e) {
    themes.value = darkTheme;
    action.value = false
  } else {
    themes.value = lightTheme;
    action.value = true
  }

}
const getSoftwareData = ()=>{
  PaymentService.checkDate().then((res)=>{
    if(!res.live){
      router.push({path:'/software-payment'});
      localStorage.clear();
    }
  })
}
onMounted(()=>{
  getSoftwareData();
})
</script>
<template>
  <n-config-provider :theme="themes" :theme-overrides="action ? menuStyle:''" :locale="uzUz" >
    <n-loading-bar-provider>
      <n-dialog-provider>
        <n-message-provider>
          <n-notification-provider>
            <n-loading-bar-provider>
              <div class="app-box">
                <App  @themeupdate="changeTheme" />
              </div>
            </n-loading-bar-provider>
          </n-notification-provider>
        </n-message-provider>
      </n-dialog-provider>
    </n-loading-bar-provider>
  </n-config-provider>
</template>

