<script setup>
import { ref, onMounted, h, inject } from "vue";
import { useRouter } from "vue-router";
import ModelService from "../../../services/studentPay.service";
import html2pdf from "html2pdf.js";

import {
  ArrowDownload24Filled as DownloadIcon,
  Print24Filled as PrintIcon,
} from "@vicons/fluent";

const props = defineProps(["type", "id"]);
const emit = defineEmits(["create", "update", "close", "no-action"]);
const dayJS = inject("dayJS");
const router = useRouter();
const checkData = ref({});
const checkRef = ref("");

onMounted(() => {
  if (props.type == "check") {
    ModelService.getOne(props.id).then((res) => {
      checkData.value = res;
    });
  }
});

const checkPrint = () => {
  let element = document.getElementById("printMe");
  document.body.innerHTML = element.innerHTML;
  print();
  router.go();
};
const allowClick = ref(true);
const pdfConvert = async () => {
  if (allowClick.value) {
    let element = document.getElementById("printMe");
    const pdfOptions = {
      margin: 10,
      filename: "document.pdf",
      image: { type: "jpeg", quality: 0.98 },
      html2canvas: { scale: 2 },
      jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
    };
    html2pdf()
      .from(element)
      .set(pdfOptions)
      .save(
        `${ checkData.value.user ? "№" + checkData.value.id + " " + checkData.value.user.fullname + ".pdf" : "document.pdf" }`,
      );
    setTimeout(() => {
      emit("close");
    }, 1500);
    allowClick.value = false;
  }
};

//// print automatic start
const printLoading = ref(true);
const printObj = ref({
  id: "printMe",
  popTitle: "good print",
  extraCss:
    "https://cdn.bootcdn.net/ajax/libs/animate.css/4.1.1/animate.compat.css, https://cdn.bootcdn.net/ajax/libs/hover.css/2.3.1/css/hover-min.css",
  extraHead: '<meta http-equiv="Content-Language"content="zh-cn"/>',
  beforeOpenCallback(vue) {
    vue.printLoading = true;
    console.log("beforeOpenCallback");
  },
  openCallback(vue) {
    vue.printLoading = false;
    console.log("openCallback");
  },
  closeCallback(vue) {
    console.log("closeCallback");
  },
});
//// print automatic end
</script>
<template>
<div class="student-check">
  <div class="student-check-content" id="printMe" >
    <div class="student-check-header">
      <h4 class="text-center">
        {{ checkData.branch ? checkData.branch.name : "" }}
      </h4>
      <h4 class="text-center">№{{ checkData.id }} Talaba to'lov</h4>
    </div>
    <div class="student-check_item">
      <b>Sana</b>
      <b>
        {{ dayJS(checkData.datetime * 1000).format("YYYY-MM-DD HH:mm:ss") }}
      </b>
    </div>
    <div class="student-check_item">
      <b>Talaba</b>
      <b>{{ checkData.user ? checkData.user.fullname : "" }}</b>
    </div>
    <div class="student-check_item">
      <b>Guruh</b>
      <b>{{ checkData.group ? checkData.group.name : "" }}</b>
    </div>
    <div class="student-check_item">
      <b>Kurs</b>
      <b>{{ checkData.course ? checkData.course.name : "" }}</b>
    </div>
    <div class="student-check_item">
      <b>Kurs narxi</b>
      <b>
        {{
          new Intl.NumberFormat("ru-RU", {
            style: "decimal",
          }).format(checkData.course_price)
        }}
      </b>
    </div>
    <div class="student-check_item">
      <b>To'lov turi</b>
      <b>{{ checkData.pay_type ? checkData.pay_type.name : "" }}</b>
    </div>
    <div class="student-check_item">
      <b>Chegirma</b>
      <b>
        {{
          new Intl.NumberFormat("ru-RU", {
            style: "decimal",
          }).format(checkData.discount_sum)
        }}
      </b>
    </div>
    <div class="student-check_item">
      <b>To'landi</b>
      <b>
        {{
          new Intl.NumberFormat("ru-RU", {
            style: "decimal",
          }).format(checkData.pay_sum)
        }}
      </b>
    </div>
    <div class="student-check_item">
      <b>Jami</b>
      <b>
        {{
          new Intl.NumberFormat("ru-RU", {
            style: "decimal",
          }).format(checkData.pay_sum - checkData.discount_sum)
        }}
      </b>
    </div>

    <div class="student-check_item">
      <b>Izoh</b>
      <b>{{ checkData.comment }}</b>
    </div>
  </div>
  <div class="student-check-footer">
    <n-button type="info" v-print="printObj" id="loading" v-show="printLoading">
      <n-icon size="24">
        <PrintIcon />
      </n-icon>
      Chop etish
    </n-button>
    <n-button type="warning" @click="pdfConvert">
      <n-icon size="24">
        <DownloadIcon />
      </n-icon>
      Yuklash
    </n-button>
  </div>
</div>
</template>

<style scoped>
.student-check_item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  border-bottom: 2px dotted black;
  padding: 3px 0px;
}
@media print {
  .student-check_item b{
    font-size: 11px !important;
  }
}

.student-check-footer {
  padding: 4px 0px;
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 12px;
}
</style>
