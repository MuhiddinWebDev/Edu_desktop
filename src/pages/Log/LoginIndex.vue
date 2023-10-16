<script setup>
import { ref, onMounted } from "vue";
import { useRouter } from "vue-router";
import BranchService from "../../services/branch.service";
import PaymentService from "../../services/softwarePayment.service";
import LoadingUI from "../../components/Animation/Loading/Load.vue";

import { PhoneFilled as phoneIcon } from "@vicons/carbon";
import { LockClosed24Filled as lockIcon } from "@vicons/fluent";

import axios from "axios";
const router = useRouter();
const showUI = ref(false)
///// sign in functionality
const sign_form = ref(null);
const signData = ref({
  phone: "998",
  password: "",
});
const sign_rules = {
  phone: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Telefon raqam majburiy!");
      }else if(value.length < 12){
        return new Error("Telefon raqamni to'liq kiriting")
      }
    },
  },

  password: {
    required: true,
    trigger: "blur",
    message: "Parol majburiy",
  },
};
const signin = async () => {
  try {
    const validate = await sign_form.value?.validate();
    axios.post("users/login", signData.value).then((res) => {
      showUI.value = true;
      localStorage.setItem("token", res.token);
      localStorage.setItem("fullname", res.fullname);
      localStorage.setItem("phone", res.phone);
      localStorage.setItem("role", res.role);
      localStorage.setItem("filial_id", res.filial_id);
      localStorage.setItem("id", res.id);
      if (res.role == "Admin" || res.role == "SuperAdmin") {
        router.push({ name: "Admin" });
      }
      // else if (res.role == "User") {
      //   router.push({ name: "User" });
      // }
      else if (res.role == "Teacher") {
        router.push({ name: "Teacher" });
      }
    }).catch((err)=>{
      showUI.value = false
    });
  } catch (e) {
    showUI.value = false
  }
};
const signKey = (e) => {
  if (e.key == "Enter") {
    signin();
  }
};
const branchOptions = ref([]);
const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOptions.value = res;
  });
};
////////////////////////////////
////////////// sign up functions////////////////////////////////

const up_data_form = ref(null);
const up_data = ref({
  fullname: "",
  phone: "",
  password: "",
  confirmPassword: "",
  lang: "uz",
  filial_id: null,
});

const up_data_rules = {
  phone: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value.length <= 8) {
        return new Error("Telefon raqam 8 tadan ko'p bo'lishi kerak   ");
      } else if (value == "") {
        return new Error("Telefon raqam bo'sh ");
      }
    },
  },
  fullname: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value.length <= 3) {
        return new Error("To'liq ismi sharfi  3 tadan ko'p bo'lishi kerak   ");
      } else if (value == "") {
        return new Error("To'liq ismi sharfi bo'sh ");
      }
    },
  },
  role: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Huquqi majburiy!");
      }
    },
  },
  password: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Parol majburiy!");
      }
    },
  },
  confirmPassword: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == "") {
        return new Error("Qayta terish parol majburiy!");
      } else if (value != up_data.value.password) {
        return new Error("Qayta terish parol bir xil emas");
      }
    },
  },
};
const changeLang = (lang) => {
  if (lang) {
    up_data.value.lang = "uz";
  } else {
    up_data.value.lang = "ru";
  }
};
const railStyle = ({ focused, checked }) => {
  const style = {};
  if (checked) {
    style.background = "#253e35";
    if (focused) {
      style.boxShadow = "0 0 0 2px #253e35";
    }
  } else {
    style.background = "#2080f0";
    if (focused) {
      style.boxShadow = "0 0 0 2px #2080f040";
    }
  }
  return style;
};
const singup = async () => {
  try {
    const validate = await up_data_form.value?.validate();
    axios.post("users/sign-up", up_data.value).then((res) => {
      if (res.role == "User") {
        router.push({ name: "User" });
      }
    });
  } catch (e) {}
};

const localLogin = () => {
  let localData = {
    token: localStorage.getItem("token"),
    role: localStorage.getItem("role"),
  };
  if (localData.token) {
    if (localData.role == "Admin" || localData.role == "SuperAdmin") {
      router.push({ name: "Admin" });
    }
    // else if (res.role == "User") {
    //   router.push({ name: "User" });
    // }
    else if (localData.role == "Teacher") {
      router.push({ name: "Teacher" });
    }
  }
};
const getSoftwareData = () => {
  PaymentService.checkDate()
    .then((res) => {
      if (!res.live) {
        router.push({ path: "/software-payment" });
      } else {
      }
    })
    .catch((err) => {
      console.log("Login error");
    });
};
////////////////////////////////
const onlyAllowNumber = (value) => !value || /^\d+$/.test(value);
////// input number format
onMounted(() => {
  // getAllBranches();
  getSoftwareData();
});

// const formatPhoneNumber = () => {
//   let formattedNumber = signData.value.phone.replace(/\D/g, "");

//   // Format the phone number as (123) 456-7890
//   if (formattedNumber.length >= 12) {
//     formattedNumber = `${formattedNumber.slice(0, 3)} ${formattedNumber.slice(
//       3,
//       5
//     )} ${formattedNumber.slice(5, 8)} ${formattedNumber.slice(
//       8,
//       10
//     )} ${formattedNumber.slice(10, 12)}`;
//   }

//   signData.value.phone = formattedNumber;
// };
// const debounceTimer = ref(300)
// const onPhoneNumberInput = () => {
//   if (debounceTimer.value) {
//     clearTimeout(debounceTimer.value);
//   }
//   console.log(debounceTimer.value);
//   debounceTimer.value = setTimeout(formatPhoneNumber(), 300);
// };
////// input number format
</script>
<template>
  <div class="login">
    <!-- <div class="login-action" @click="router.push({ name: 'main-home' })">
      <p>Bosh sahifa</p>
    </div> -->
    <div class="login-box">
      <n-card :bordered="false" :style="{ borderRadius: '15px' }" size="large">
        <h1 class="text-center">Kirish</h1>
        <n-form :model="signData" ref="sign_form" :rules="sign_rules">
          <div class="login-padding">
            <n-form-item @keydown="signKey" label="Telefon raqam" path="phone">
              <n-input
                :maxlength="12"
                :minlength="12"
                size="large"
                show-count
                clearable
                :allow-input="onlyAllowNumber"
                v-model:value="signData.phone"
              >
                <template #prefix>
                  <n-icon color="#000">
                    <phoneIcon />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <n-form-item label="Parol" path="password">
              <n-input
                @keydown="signKey"
                type="password"
                size="large"
                :minlength="8"
                show-count
                clearable
                show-password-on="click"
                v-model:value="signData.password"
              >
                <template #prefix>
                  <n-icon color="#000">
                    <lockIcon />
                  </n-icon>
                </template>
              </n-input>
            </n-form-item>
            <div class="btn-center">
              <div class="btn-center_item">
                <n-button
                  @click="signin"
                  color="#333"
                  type="primary"
                  block
                  round
                  size="large"
                >
                  Kirish
                </n-button>
              </div>
            </div>
          </div>
        </n-form>
        <!-- <n-tabs
          type="line"
          class="card-tabs"
          default-value="Kirish"
          size="medium"
          animated
        >
          <n-tab-pane name="Kirish" tab="Kirish">
           
           
          </n-tab-pane>
          <n-tab-pane name="Ro'yxatdan o'tish" tab="Ro'yxatdan o'tish">
           
            <n-form :model="up_data" ref="up_data_form" :rules="up_data_rules">
              <div class="login-padding">
                <n-grid cols="1 s:1 m:2 l:2" responsive="screen" :x-gap="12">
                  <n-grid-item>
                    <n-form-item label="Filial" path="filial_id">
                      <n-select
                        :options="branchOptions"
                        v-model:value="up_data.filial_id"
                        value-field="id"
                        label-field="name"
                        filterable
                        clearable
                      >
                      </n-select>
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item>
                    <n-form-item label="To'liq ism sharifi" path="fullname">
                      <n-input
                        :maxlength="50"
                        :minlength="3"
                        show-count
                        size="large"
                        clearable
                        v-model:value="up_data.fullname"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item>
                    <n-form-item label="Telfon raqam" path="phone">
                      <n-input
                        :maxlength="25"
                        :minlength="8"
                        show-count
                        size="large"
                        clearable
                        :allow-input="onlyAllowNumber"
                        v-model:value="up_data.phone"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item>
                    <n-form-item label="Parol" path="password">
                      <n-input
                        type="password"
                        size="large"
                        :minlength="8"
                        show-count
                        clearable
                        v-model:value="up_data.password"
                        show-password-on="mousedown"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item>
                    <n-form-item
                      label="Parol qayta kiritish "
                      path="confirmPassword"
                    >
                      <n-input
                        type="password"
                        size="large"
                        :minlength="8"
                        show-count
                        clearable
                        v-model:value="up_data.confirmPassword"
                        show-password-on="mousedown"
                      />
                    </n-form-item>
                  </n-grid-item>
                  <n-grid-item>
                    <n-form-item label="Tili" path="lang">
                      <n-switch
                        @update:value="changeLang"
                        size="large"
                        :value="up_data.lang == 'uz' ? true : false"
                        :rail-style="railStyle"
                      >
                        <template #checked> Uzbek </template>
                        <template #unchecked> Russian </template>
                      </n-switch>
                    </n-form-item>
                  </n-grid-item>
                </n-grid>
                <div class="btn-center">
                  <div class="btn-center_item">
                    <n-button @click="singup" type="primary" size="large" block>
                      Ro'yxatdan o'tish
                    </n-button>
                  </div>
                </div>
              </div>
            </n-form>
          </n-tab-pane>
        </n-tabs> -->
      </n-card>
    </div>
    <LoadingUI v-if="showUI" />
  </div>
</template>

<style scoped>
.login-padding {
  padding: 15px 0px;
}
.btn-center_item {
  padding: 8px 20px;
  padding-bottom: 0px;
}
.login .position-fixed{
  border-radius: 10px;
  background: #4b494956;
}
</style>
