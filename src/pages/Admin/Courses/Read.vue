<!-- Course Form -->
<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../../services/course.service";

import { Exit as ExitIcon } from "@vicons/ionicons5";

const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);
const img_url = inject("course_img");
const user_image = inject("img_url");
const play_url = inject("course_video");

const readData = ref({
  course_plan: [],
});

onMounted(() => {
  if (props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      readData.value = res;
    });
  }
});

const exit = () => {
  emit("close");
};

///
</script>
<template>
  <div class="model-read">
    <n-tabs type="line" animated>
      <n-tab-pane name="Kurs" tab="Kurs">
        <div class="model-read-image" v-if="readData.image">
          <n-image
            lazy
            width="100"
            height="100"
            :style="{ borderRadius: '50%' }"
            :src="img_url + readData.image"
          >
          </n-image>
        </div>
        <div class="no-image" v-else>
          <div class="no-image_item"><b>Rasm yo'q</b></div>
        </div>
        <div class="model-read-row">
          <b>Kurs nomi</b>
          <b>{{ readData.name }}</b>
        </div>
        <div class="model-read-row">
          <b>Kurs darajasi</b>
          <b>{{
            readData.level == "junior"
              ? "Boshlang'ich"
              : readData.level == "middle"
              ? "O'rtacha"
              : "Murakkab"
          }}</b>
        </div>
        <div class="model-read-row">
          <b>O'qituvchi:</b>
          <b>{{ readData.teachers ? readData.teachers.fullname : null }}</b>
        </div>
        <div class="model-read-row">
          <b>Kurs narxi:</b>
          <b>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(readData.price_month)
            }}
            so'm</b
          >
        </div>
        <div class="model-read-row">
          <b>Darslar soni</b>
          <b>{{ readData.lang }}</b>
        </div>
        <div class="model-read-row">
          <b>Darslar soni</b>
          <b>{{ readData.course_plan.length }} ta</b>
        </div>
        <div class="model-read-row">
          <b>Filial</b>
          <b>{{ readData.branch ? readData.branch.name : null }}</b>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Kurs reja" tab="Kurs reja">
        <div class="model-read-row" style="padding-bottom: 12px; border: none">
          <b>Jami darslar</b>
          <b>{{ readData.course_plan ? readData.course_plan.length : 0 }} ta</b>
        </div>
        <n-scrollbar style="max-height: 255px" trigger="none">
          <div
            class="model-read-row"
            v-for="(item, index) in readData.course_plan"
            :key="index"
          >
            <b>№{{ index + 1 }} Dars nomi</b>
            <b>{{ item.name }}</b>
          </div>
        </n-scrollbar>
      </n-tab-pane>
    </n-tabs>
    <div class="btn-action">
      <n-button @click="exit" type="warning">
        <template #icon>
          <exit-icon />
        </template>
        Chiqish
      </n-button>
    </div>
  </div>
</template>

<style scoped>
.btn-action {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  padding-top: 15px;
}
.model-read-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 0px;
  border-bottom: 2px dotted;
}
.no-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
.no-image_item {
  padding: 25px 10px;
  border-radius: 50%;
  background: #e4dfdf;
}
.model-read-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
