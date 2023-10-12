<script setup>
import { ref } from "vue";
import {
  TelegramFilled as telegramIcon,
  LocalPhoneSharp as phoneIcon,
} from "@vicons/material";
import { useNotification } from "naive-ui";
import { useRouter } from "vue-router";
import SoftwareService from "../../services/softwarePayment.service";
const devModal = ref(false);
const notification = useNotification();
const router = useRouter();
const rules = {
  role: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Huquq majburiy");
      }
    },
  },
  password: {
    required: true,
    trigger: "blur",
    validator: (rule, value) => {
      if (value == null) {
        return new Error("Parol majburiy");
      }
    },
  },
};
const formRef = ref(null);
const showSpin = ref(false);
const form_data = ref({
  role: null,
  password: null,
});
const devClick = () => {
  devModal.value = true;
};
const saveClick = async () => {
  showSpin.value = true;
  try {
    const result = await formRef.value?.validate();
    SoftwareService.checkDate(form_data.value)
      .then((res) => {
        showSpin.value = false;
        console.log(res)
        if (!res.live) {
          notification.error({
            content: "Xatolik",
            meta: "Huquq yoki Parol xato",
            duration: 2500,
            keepAliveOnHover: true,
          });
          form_data.value.role = null;
          form_data.value.password = null;
        } else {
          devModal.value = false;
          router.push({path:'/login'})
        }
      })
      .catch((e) => {
        showSpin.value = false;
      });
  } catch (e) {
    showSpin.value = false;
  }
};
</script>
<template>
  <div class="software-page">
    <div class="devoloper-box">
      <n-button type="success" @click="devClick">Dasturchi</n-button>
    </div>
    <n-result
      status="info"
      title="Dastur amal qilish muddati tugadi."
      description="Dasturchi bilan bog'lanish +998 90 778 87 69"
    >
      <template #footer>
        <div class="connect-devoloper">
          <a href="tel:+998907788769">
            <n-icon size="20">
              <phoneIcon />
            </n-icon>
            Telefon
          </a>
          <a href="https://t.me/xazratqulov_muhiddin">
            <n-icon size="20">
              <telegramIcon />
            </n-icon>
            Telegram
          </a>
        </div>
      </template>
    </n-result>
    <n-modal v-model:show="devModal" :mask-closable="false">
      <n-card
        transform-orign="center"
        style="max-width: 500px; width: calc(100vw - 35px)"
        title="Dasturchi"
        :bordered="false"
        size="medium"
        role="dialog"
        aria-modal="true"
        closable
        @close="devModal = false"
      >
        <n-form
          :style="{ height: '100%' }"
          ref="formRef"
          :model="form_data"
          :rules="rules"
        >
          <n-spin :show="showSpin">
            <n-form-item label="Huquqi" path="role">
              <n-input v-model:value="form_data.role" clearable></n-input>
            </n-form-item>
            <n-form-item label="Parol" path="password">
              <n-input
                type="password"
                v-model:value="form_data.password"
                show-password-on="click"
                placeholder="Parol"
                clearable
              ></n-input>
            </n-form-item>
            <n-button @click="saveClick" type="success">Saqalsh</n-button>
          </n-spin>
        </n-form>
      </n-card>
    </n-modal>
  </div>
</template>
<style scoped>
.devoloper-box {
  position: fixed;
  right: 10px;
  top: 10px;
}

.software-page {
  width: 100%;
  height: 100vh;
  display: grid;
  align-items: center;
}

.connect-devoloper a {
  text-decoration: none;
  margin: 4px 8px;
  padding: 8px 12px;
  border-radius: 7px;
  color: #fff;
}

.connect-devoloper a:nth-last-child(1) {
  background: #2080f0;
}

.connect-devoloper a:nth-child(1) {
  background: #18a058;
}

.connect-devoloper {
  display: flex;
  align-items: center;
  justify-content: center;
}

.connect-devoloper a {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
