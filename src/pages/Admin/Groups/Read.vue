<script setup>
import { ref, onMounted } from "vue";
import ModelService from "../../../services/groups.service";
import { Exit as ExitIcon } from "@vicons/ionicons5";

const props = defineProps(["type", "id", "defaultname"]);
const emit = defineEmits(["create", "update", "close"]);

const readData = ref({});
const studentData = ref([])

onMounted(() => {
  if (props.type == "read") {
    ModelService.getOne(props.id).then((res) => {
      readData.value = res;
    });
    let searchData ={
        parent_id: props.id
    }
    ModelService.groupTableAll(searchData).then((res)=>{
        studentData.value = res;
    })
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
      <n-tab-pane name="Guruh" tab="Guruh">
        <div class="model-read-row">
          <b>Guruh nomi</b>
          <b>{{ readData.name }}</b>
        </div>
        <div class="model-read-row">
          <b>Kurs nomi</b>
          <b>{{ readData.course ? readData.course.name : null }}</b>
        </div>
        <div class="model-read-row">
          <b>Kurs darajasi</b>
          <b>{{ 
          readData.course  && readData.course.level == 'junior' ? "Boshlang'ich" 
          : readData.course  && readData.course.level == 'middle' ? "O'rtacha"
          : readData.course  && readData.course.level == 'senior' ? "Murakkab": null }}</b>
        </div>
        <div class="model-read-row">
          <b>O'qituvchi:</b>
          <b>{{ readData.course ? readData.course.teachers.fullname : null }}</b>
        </div>
        <div class="model-read-row">
          <b>Kurs narxi:</b>
          <b>
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(readData.course ? readData.course.price_month :0)
            }}
            so'm</b
          >
        </div>
       
        <div class="model-read-row">
          <b>Talabalar soni</b>
          <b>{{ readData.count }} ta</b>
        </div>
        <div class="model-read-row">
          <b>Qabul soni</b>
          <b>{{ readData.max_count }} ta</b>
        </div>
        <div class="model-read-row">
          <b>Filial</b>
          <b>{{ readData.branch ? readData.branch.name : null }}</b>
        </div>
      </n-tab-pane>
      <n-tab-pane name="Talabalar" tab="Talabalar">
        <div class="model-read-row" style="padding-bottom: 12px; border: none">
          <b>Jami talabalar soni</b>
          <b>{{ studentData.length }} ta</b>
        </div>
        <n-scrollbar style="max-height: 300px" trigger="none">
          <div
            class="model-read-row"
            v-for="(item, index) in studentData"
            :key="index"
          >
            <b>№{{ item.user_id}}</b>
            <b>{{ item.users ? item.users.fullname: null }}</b>
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

.model-read-image {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
