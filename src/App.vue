<script setup>
import { watch, ref } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useNotification, useLoadingBar } from "naive-ui";
import { useErrorStore } from "./stores/errors";
import { useCounterStore } from "./stores/counter";
import BranchService from "./services/branch.service";

const router = useRouter();
const route = useRoute();
const loadingBar = useLoadingBar();
const notification = useNotification();
const loadItem = useCounterStore();
const findBranch = ref(JSON.parse(localStorage.getItem('filial_id')));
const branchName =ref("");
const Default_title = ref("Education");

const getBranch = async () =>{
  if(findBranch.value){
    BranchService.getOne(findBranch.value).then((response) => {
      branchName.value = response.name;
    }).catch((err)=>{
      branchName.value = ""
    })
  }
}

router.beforeEach(() => {
  loadingBar.start();
  loadItem.loadAction = true;
  getBranch()
});
router.afterEach(() => {
  loadingBar.finish();
  let path_val = route.name;
  document.title = path_val + ` | ${branchName.value}` || Default_title;
  loadItem.loadAction = false;
});
router.onError(() => {
  loadingBar.error();
});
const error_store = useErrorStore();

watch(
  () => error_store.error_text,
  (val) => {
    if (val != "") {
      notification.error({
        content: "Xatolik",
        meta: val.toString(),
        duration: 4000,
        keepAliveOnHover: true,
      });
    }
    setTimeout(() => {
      error_store.error_text = "";
    }, 1000);
  }
);
</script>

<template>
  <router-view></router-view>
</template>
