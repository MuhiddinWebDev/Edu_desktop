<script setup>
import { ref, h, onMounted, defineEmits, watch, inject } from "vue";
import { useFullscreen } from "@vueuse/core";
import { useRouter } from "vue-router";
import LoadingUI from "../../components/Animation/Loading/Load.vue"
import { NIcon } from "naive-ui";
import { useMessage, useDialog } from "naive-ui";
import {
  LineHorizontal320Filled as threeBtn,
  FullScreenMaximize24Regular as MaxScreenIcon,
  Settings24Filled as SettingIcon,
  WeatherSunny24Filled as SunIcon,
  WeatherMoon24Filled as MoonIcon,
  Camera24Filled as cameraIcon,
  PersonEdit24Filled as PersonIcon,
  LocalLanguage24Filled as LangIcon,
  Branch24Filled as BranchIcon,
  ConferenceRoom24Filled as roomIcon,
  Class24Filled as ClassIcon,
  ClockAlarm24Filled as clockIcon,
  ShareScreenPersonOverlay28Filled as TeacherIcon,
  Money24Filled as MoneyIcon,
  TableSimple24Filled as LessonTableIcon,
  ClipboardTextRtl24Filled as couseText,
  AppsList24Filled as spendIcon,
  BuildingBank24Filled as MarkazIcon,
  MoneySettings20Filled as payTypeIcon,
  Payment24Filled as PayCardIcon
} from "@vicons/fluent";
import {
  PhoneRound as phoneIcon,
  PersonOutlineRound as UserRound,
  PlayLessonRound as LessonIcon,
  GroupAddFilled as GroupIcon,
  RestoreSharp as RestIcon,
  DiscountFilled as DiscountIcon,
  AdminPanelSettingsFilled as AdminIcon,
  PeopleAltFilled as Parents,
} from "@vicons/material";
import {
  PersonCircleOutline as UserIcon,
  LogOutOutline as LogoutIcon,
  Home as homeIcon,
} from "@vicons/ionicons5";
import {
  Education as StudentIcon,
  ReportData as ReportIcon,
  UserProfileAlt as UserMain,
} from "@vicons/carbon";
import AdminForm from "./AdminForm.vue";
import ModelService from "../../services/users.service";
import BranchService from "../../services/branch.service";
import { useCounterStore } from "../../stores/counter";

const { isFullscreen, enter, exit, toggle } = useFullscreen();
const router = useRouter();
const badge = ref("5");
const settingBtn = ref(false);
const message = useMessage();
const dialog = useDialog();
const profileSetting = ref(false);
const emits = defineEmits(["themeupdate"]);
const counter = useCounterStore();
const findRole = ref(localStorage.getItem("role"));
const img_url = inject("img_url");

function renderIcon(icon) {
  return () => h(NIcon, null, { default: () => h(icon) });
}

const userSetting = (e) => {
  if (e == "settings") {
    settingBtn.value = true;
  } else if (e == "logout") {
    dialog.info({
      title: "Ma'lumot",
      content: "Tizimdan chiqmoqchimisiz?",
      positiveText: "Chiqish",
      negativeText: "Bekor qilish",
      onPositiveClick: () => {
        message.success("Tizimdan chiqildi");
        router.push({ name: "Login" });
        emits("themeupdate", false);
        localStorage.clear();
      },
      onNegativeClick: () => {
        message.error("Bekor qilindi");
      },
    });
  } else if (e == "profile") {
    profileSetting.value = true;
  }
};

const saveSetting = (e) => {
  message.success("Save");
  if (e == "profile") {
    profileSetting.value = false;
  } else if (e == "setting") {
    settingBtn.value = false;
  }
};


const findDevoloper = ()=>{
  let findMe = localStorage.getItem('phone');
  console.log(findMe)
  if(findMe == '998907788769'){
    return true
  }
  return false;
}


const menuOptions = [
  {
    label: "Bosh sahifa",
    key: "Bosh sahifa",
    icon: renderIcon(homeIcon),
  },
  {
    key: "divider-1",
    type: "divider",
    props: {
      style: {
        margin: "2px 2px 8px 2px ",
      },
    },
  },
  {
    label: "Hisobotlar ",
    key: "Hisobotlar ",
    icon: renderIcon(ReportIcon),
  },
  {
    label: "Xujjatlar",
    key: "documents",
    icon: renderIcon(MarkazIcon),
    children: [
      {
        label: "Darslar",
        key: "Darslar",
        icon: renderIcon(ClassIcon),
      },
      {
        label: "Davomat olish",
        key: "Davomat olish",
        icon: renderIcon(clockIcon),
      },
      {
        label: "Dars jadvali",
        key: "Dars jadvali",
        icon: renderIcon(LessonTableIcon),
      },
      {
        label: "Xarajatlar ",
        key: "Xarajatlar ",
        icon: renderIcon(spendIcon),
      },
      {
        label: "Talabalar to'lovi",
        key: "Talabalar to'lovi",
        icon: renderIcon(StudentIcon),
      },
      {
        label: "O'qituvchilar to'lovi",
        key: "O'qituvchilar to'lovi",
        icon: renderIcon(TeacherIcon),
      },
    ],
  },
  {
    label: "Ma'lumotlar",
    key: "information",
    icon: renderIcon(MarkazIcon),
    children: [
      {
        label: "Filiallar",
        key: "Filiallar",
        show: findRole.value == "SuperAdmin" ? true : false,
        icon: renderIcon(BranchIcon),
      },
      {
        label: "Xonalar",
        key: "Xonalar",
        icon: renderIcon(roomIcon),
      },
      {
        label: "Foydalanuvchilar",
        key: "Foydalanuvchilar",
        icon: renderIcon(UserMain),
      },
      {
        label: "Adminlar",
        key: "Adminlar",
        icon: renderIcon(AdminIcon),
      },
      {
        label: "O'qituvchilar",
        key: "O'qituvchilar",
        icon: renderIcon(PersonIcon),
      },
      {
        label: "Talabalar",
        key: "Talabalar",
        icon: renderIcon(StudentIcon),
      },
      {
        label: "Ota onalar",
        key: "Ota onalar",
        icon: renderIcon(Parents),
      },
      {
        label: "Kurslar",
        key: "Kurslar",
        icon: renderIcon(LessonIcon),
      },
      {
        label: "Guruhlar",
        key: "Guruhlar",
        icon: renderIcon(GroupIcon),
      },
      {
        label: "Dam olish",
        key: "Dam olish",
        icon: renderIcon(RestIcon),
      },
      {
        label: "To'lov turi",
        key: "To'lov turi",
        icon: renderIcon(payTypeIcon),
      },
      {
        label: "Chegirmalar",
        key: "Chegirmalar",
        icon: renderIcon(DiscountIcon),
      },
      {
        label: "Ish haqqi",
        key: "Ish haqqi",
        icon: renderIcon(MoneyIcon),
      },
      {
        label: "Xarajat sabablari",
        key: "Xarajat sabablari",
        icon: renderIcon(couseText),
      },
      // {
      //   label:"CRM",
      //   key: "CRM",
      //   icon:renderIcon(HeadsetIcon)
      // },
      // {
      //   label: "Xabarlar",
      //   key: "Xabarlar",
      //   icon: renderIcon(MailIcon),
      // },
      // {
      //   label: "Savol-Javob",
      //   key: "Savol-Javob",
      //   icon: renderIcon(QuizIcon),
      // },
    ],
  },
  {
    label: "Sozlamalar",
    key: "read",
    icon: renderIcon(SettingIcon),
    show: findDevoloper(),
    children: [
      {
        type: "group",
        label: "Sahifalar",
        key: "people",
        children: [
          // {
          //   label: "Asosiy sahifa",
          //   key: "Asosiy sahifa",
          //   icon: renderIcon(SiteSetting),
          // },
          {
            label:"Dastur to'lovi",
            key:"Dastur to'lovi",
            icon: renderIcon(PayCardIcon)
          }
        ],
      },
    ],
  },
];

const userOption = [
  {
    label: "Profil",
    key: "profile",
    icon: renderIcon(UserIcon),
  },
  {
    label: "Sozlamalar",
    key: "settings",
    icon: renderIcon(SettingIcon),
  },
  {
    label: "Chiqish",
    key: "logout",
    icon: renderIcon(LogoutIcon),
  },
];

const ThemeAction = ref(false);
const collapsed = ref(false);
const selectMenu = ref(null);
const topMenu = ref(false);
const leftMenu = ref(true);
const ResponsiveMenu = ref(false);

const navbarBtn = () => {
  ResponsiveMenu.value = true;
  if (collapsed.value) {
    collapsed.value = false;
  } else {
    collapsed.value = true;
  }
};

const panels = ref(["Bosh sahifa"]);
const accordionValue = ref([]);
const tabName = ref(null);

const updateValue = (e) => {
  router.push({ name: e });
  selectMenu.value = e;
  localStorage.setItem("selected", selectMenu.value);
  tabName.value = e;
  const index = panels.value.findIndex((val) => val == e);
  if (index == -1) {
    panels.value.push(e);
    localStorage.setItem("PanelsArray", JSON.stringify(panels.value));
  }
  ResponsiveMenu.value = false;
};

const UpdateAccordion = (e) => {
  accordionValue.value = e;
  localStorage.setItem("accordion", accordionValue.value);
};

const leftClick = () => {
  topMenu.value = false;
  leftMenu.value = true;
};

const branchName = ref("");
const getBranchName = () => {
  let branchId = JSON.parse(localStorage.getItem("filial_id"));
  BranchService.getOne(branchId).then((res) => {
    branchName.value = res.name;
  });
};

watch(ThemeAction, (val) => {
  localStorage.setItem("theme", val);
  counter.theme = val;
  emits("themeupdate", val);
  if (val) {
    message.info("Tungi rejim");
  } else {
    message.info("Kungi rejim");
  }
});

watch(collapsed, (val) => {
  localStorage.setItem("collopsed", val);
});

const user_info = ref({
  image: "",
  fullname: "",
  phone: "",
  lang: "",
  show: false,
});

const user_id = ref(JSON.parse(localStorage.getItem("id")));
const cutUsername = ref("");

const getOneUser = () => {
  ModelService.getOne(user_id.value).then((res) => {
    user_info.value = res;
    cutUsername.value = res.fullname;
    cutUsername.value = cutUsername.value.split(" ")[0];
    // cutUsername.value = cutUsername.value[0]
  });
};

const closeAble = ref(true);

onMounted(() => {
  if (localStorage.getItem("collopsed") != null) {
    collapsed.value = JSON.parse(
      localStorage.getItem("collopsed").toLowerCase()
    );
  }

  if (localStorage.getItem("theme") != null) {
    ThemeAction.value = JSON.parse(localStorage.getItem("theme").toLowerCase());
  }

  getBranchName();
  getOneUser();

  if (JSON.parse(localStorage.getItem("PanelsArray")) != null) {
    panels.value = JSON.parse(localStorage.getItem("PanelsArray"));
  }

  selectMenu.value = localStorage.getItem("selected");
  accordionValue.value.push(localStorage.getItem("accordion"));
});

const name = ref(1);

const handleClose = (val) => {
  const index = panels.value.findIndex((v) => val === v);
  if (panels.value.length == 1) {
    router.push({ name: "Bosh sahifa" });
  }
  if (panels.value[index] != "Bosh sahifa") {
    panels.value.splice(index, 1);
    localStorage.setItem("PanelsArray", JSON.stringify(panels.value));
  }
  if (index) {
    message.info(val + " yopildi");
    name.value = panels.value[index];
  }
};

const tabFun = (e) => {
  router.push({ name: e });
  selectMenu.value = e;
  localStorage.setItem("selected", selectMenu.value);
  closeAble.value = true;
};
/////// user value updat function;

const showUpdate = ref(false);
const updateId = ref(null);
const updateUser = () => {
  showUpdate.value = false;
  getOneUser();
};
const closeUpdate = () => {
  showUpdate.value = false;
  updateId.value = null;
};
const openUpdate = () => {
  showUpdate.value = true;
  updateId.value = JSON.parse(localStorage.getItem("id"));
};
/// phone responsive
const windowWidth = ref(window.innerWidth);
window.addEventListener("resize", () => {
  windowWidth.value = window.innerWidth;
});
////
</script>
<template>
  <div class="bg-action">
    <n-layout has-sider>
      <n-layout-sider
        :bordered="true"
        class="phone"
        collapse-mode="width"
        :collapsed-width="leftMenu ? 64 : 0"
        :width="leftMenu ? 280 : 0"
        :collapsed="collapsed"
        :native-scrollbar="true"
        @expand="collapsed = false"
        :style="{
          height: '100vh',
          background: ThemeAction ? '' : '#0c1e35',
          color: '#fff',
        }"
      >
        <div
          class="navbar-header"
          :class="collapsed ? '' : 'navbar-header_active'"
        >
          <n-avatar
            size="small"
            src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
          ></n-avatar>
          <h1 v-if="!collapsed">{{ branchName }}</h1>
        </div>
        <n-menu
          accordion
          :collapsed="collapsed"
          v-model:value="selectMenu"
          :collapsed-width="64"
          :collapsed-icon-size="18"
          :options="menuOptions"
          :on-update:value="updateValue"
          @update:expanded-keys="UpdateAccordion"
          :default-expanded-keys="accordionValue"
          :class="ThemeAction ? '' : 'admin-menu'"
        >
        </n-menu>
      </n-layout-sider>
      <n-layout
        :style="{ background: !ThemeAction ? '#fdfafa91' : '' }"
        :has-sider="false"
      >
        <div class="header">
          <div class="header-item" v-if="leftMenu" id="SideBarBtn">
            <n-icon @click="navbarBtn" size="24">
              <threeBtn />
            </n-icon>
          </div>
          <div class="header-item" v-if="topMenu">
            <n-avatar
              size="small"
              src="https://cdnimg103.lizhi.fm/user/2017/02/04/2583325032200238082_160x160.jpg"
            ></n-avatar>
            <h2>{{ branchName }}</h2>
          </div>
          <div class="header-item">
            <!-- <n-popover trigger="click">
              <template #trigger>
                <n-badge :processing="false" :max="15" :show="true" :value="badge">
                  <n-icon size="24">
                    <NoteIcon></NoteIcon>
                  </n-icon>
                </n-badge>
              </template>
              <n-tabs type="card">
                <n-tab-pane name="Menu0">
                  <template #tab>
                    Menu0
                    <n-badge :value="1" :max="15"> </n-badge>
                  </template>
                  <h2>New come message</h2>
                </n-tab-pane>
                <n-tab-pane name="Menu1">
                  <template #tab>
                    Menu1
                    <n-badge :value="3" :max="15"> </n-badge>
                  </template>
                  <h2>Salom</h2>
                </n-tab-pane>
                <n-tab-pane name="Menu2">
                  <template #tab>
                    Menu2
                    <n-badge :value="1" :max="15"> </n-badge>
                  </template>
                  <h2>Hayr</h2>
                </n-tab-pane>
              </n-tabs>
            </n-popover> -->
            <n-popover trigger="hover">
              <template #trigger>
                <n-icon @click="toggle" size="24">
                  <MaxScreenIcon />
                </n-icon>
              </template>
              <span>To'liq ekran</span>
            </n-popover>

            <n-popover trigger="hover">
              <template #trigger>
                <n-switch
                  id="ChangeThemer"
                  v-model:value="ThemeAction"
                  size="large"
                >
                  <template #checked-icon>
                    <n-icon>
                      <moon-icon />
                    </n-icon>
                  </template>
                  <template #unchecked-icon>
                    <n-icon>
                      <sun-icon />
                    </n-icon>
                  </template>
                </n-switch>
              </template>
              <span>Mavzuni o'zgartirish</span>
              <span></span>
            </n-popover>
            <n-dropdown
              @select="userSetting"
              animated
              :options="userOption"
              :show-arrow="true"
              id="UserProfile"
            >
              <div class="user">
                <div class="user-avatar" v-if="user_info.image.length > 0">
                  <n-avatar size="small" round :src="img_url + '/' + user_info.image">
                    <!-- <n-icon  size="24">
                      <UserIcon />
                    </n-icon> -->
                  </n-avatar>
                </div>
                <div class="user-avatar" v-else>
                  <n-avatar size="small" round>
                    <n-icon  size="24">
                      <UserIcon />
                    </n-icon>
                  </n-avatar>
                </div>
                <p>{{ cutUsername }}</p>
              </div>
            </n-dropdown>
          </div>
        </div>

        <div class="router-save">
          <n-tabs
            @update:value="tabFun"
            v-model:value="tabName"
            type="card"
            :closable="closeAble"
            :default-value="selectMenu"
            animated
            tab-style="min-width: 120px;"
            :style="{ padding: '4px' }"
            @close="handleClose"
          >
            <n-tab-pane
              v-for="panel in panels"
              :key="panel"
              :tab="panel"
              :name="panel"
              :style="{ padding: '0' }"
            >
            </n-tab-pane>
          </n-tabs>
        </div>
        <div class="router-box">
          <RouterView >
          </RouterView>
          <LoadingUI v-if="counter.loadAction"/>
        </div>
        <n-drawer
          resizable
          v-model:show="settingBtn"
          :default-width="420"
          :style="{ height: '100vh' }"
        >
          <n-drawer-content closable>
            <template #header> Sozlamalar </template>
            <template #footer>
              <n-button @click="saveSetting('setting')" type="success"
                >Saqlash</n-button
              >
            </template>
            <n-divider title-placement="center"> Theme mode </n-divider>
            <div class="setting">
              <div class="setting-item">
                <p>Theme type</p>
                <n-switch v-model:value="ThemeAction" size="large">
                  <template #checked-icon>
                    <n-icon>
                      <moon-icon />
                    </n-icon>
                  </template>
                  <template #unchecked-icon>
                    <n-icon>
                      <sun-icon />
                    </n-icon>
                  </template>
                </n-switch>
              </div>
              <div class="setting-item">
                <p>Menu</p>
                <n-switch v-model:value="collapsed" size="large"></n-switch>
              </div>
            </div>
            <n-divider title-placement="center"> Menu layout mode </n-divider>
            <div class="setting">
              <div class="setting-item">
                <p>Menu postion left</p>
                <n-tooltip trigger="hover">
                  <template #trigger>
                    <n-button type="success" @click="leftClick">
                      Left
                    </n-button>
                  </template>
                  The menu will be placed at the left
                </n-tooltip>
              </div>
            </div>
            <n-divider title-placement="center"> Theme system color </n-divider>
            <div class="setting-color">
              <div class="setting-color_item"></div>
            </div>
          </n-drawer-content>
        </n-drawer>
        <n-drawer
          resizable
          v-model:show="profileSetting"
          :default-width="420"
          :style="{ height: '100vh' }"
        >
          <n-drawer-content closable>
            <template #header>
              <div class="profile-header">
                <n-icon size="24">
                  <UserIcon />
                </n-icon>
                <p>Profil</p>
              </div>
            </template>
            <template #footer>
              <n-button @click="saveSetting('profile')" type="success">
                Saqlash va berkitish
              </n-button>
            </template>
            <div class="profile">
              <div class="profile-user" @click="openUpdate">
                <div class="profile-user_avatar">
                  <n-avatar round :size="68" :src="user_info.image" />
                  <div class="profile-camera">
                    <n-icon size="16">
                      <cameraIcon />
                    </n-icon>
                  </div>
                </div>
                <div class="profile-user_item">
                  {{ user_info.fullname }}
                </div>
              </div>
            </div>
            <n-divider></n-divider>
            <div class="profile-info" @click="openUpdate">
              <div class="profile-info_item">
                <div class="profile-info_icon blue">
                  <n-icon size="20">
                    <UserRound />
                  </n-icon>
                </div>
                <p>{{ user_info.fullname }}</p>
              </div>
              <div class="profile-info_item">
                <div class="profile-info_icon green">
                  <n-icon size="20">
                    <phoneIcon />
                  </n-icon>
                </div>
                <p>+{{ user_info.phone }}</p>
              </div>
              <div class="profile-info_item">
                <div class="profile-info_icon orange">
                  <n-icon size="20">
                    <LangIcon />
                  </n-icon>
                </div>
                <p>{{ user_info.lang == "uz" ? "Uzbek" : "Russia" }}</p>
              </div>
            </div>
            <n-divider></n-divider>
            <!-- <div class="profile-button">
                                    <n-button @click="openUpdate()"  type="error">O'zgartirish</n-button>
                                </div> -->
          </n-drawer-content>
        </n-drawer>
      </n-layout>
    </n-layout>
  </div>
  <!-- Modal service update end create -->
  <section>
    <n-modal v-model:show="showUpdate" :mask-closable="false">
      <n-card
        class="auto-reponsive"
        title="Profil  o'zgartirish"
        :bordered="false"
        size="large"
        role="dialog"
        aria-modal="true"
        closable
        @close="showUpdate = false"
      >
        <AdminForm
          @close="closeUpdate"
          type="update"
          :id="updateId"
          @update="updateUser"
        />
      </n-card>
    </n-modal>
  </section>
  <!-- Phone responsive -->
  <section class="phone-responsive" v-if="windowWidth <= 768">
    <n-drawer
      v-model:show="ResponsiveMenu"
      :style="{
        height: '100vh',
        width: 'calc(100vw - 140px)',
        background: '#0c1e35',
      }"
      :resizable="true"
      placement="left"
    >
      <n-drawer-content
        title="Menu"
        closable
        :body-content-style="{ padding: '4px' }"
      >
        <n-menu
          v-model:value="selectMenu"
          :collapsed-icon-size="22"
          :options="menuOptions"
          :on-update:value="updateValue"
        >
        </n-menu>
      </n-drawer-content>
    </n-drawer>
  </section>
</template>
<style scoped>
.router-box{
  position: relative !important;
}
.auto-reponsive {
  max-width: 600px;
  max-height: 900px;
  overflow: hidden;
  overflow-y: auto;
}
.profile-button {
  display: flex;
  justify-content: flex-end;
}
</style>
