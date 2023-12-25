<script setup>
import { ref, onMounted, inject } from "vue";
import { Exit as ExitIcon } from "@vicons/ionicons5";
import { useMessage } from "naive-ui";
import ReportService from "../../../services/report.service";
import UserService from "../../../services/users.service";
//// report variables
const userId = ref(null);
const userOption = ref([]);
//// report  variables
/// notification variables
const message = useMessage();
/// notification variables

const getTeacherOption = () => {
  userOption.value = [];
  UserService.getAll().then((res) => {
    userOption.value = res;
  });
};

const time_def = ref(new Date());
const thisMonth = ref(
  new Date(time_def.value.getFullYear(), time_def.value.getMonth())
);
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);
///// table veribles
const loading = ref(false);
const getData = ref([]);
const dayJS = inject("dayJS");
///// table veribles
onMounted(() => {
  getTeacherOption();
});
const columns = ref([
  {
    title: "№",
    key: "id",
    width: 60,
  },
  {
    title: "Masul shaxs",
    key: "user_name",
    resizable: true,
  },
  {
    title: "Filial",
    key: "filial_name",
    resizable: true,
  },
  {
    title: "Xarajat summa",
    key: "rasxod_summa",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.rasxod_summa);
    },
  },
]);

const summa_data = ref({
  total_summa: 0,
});
const summaNol = () => {
  summa_data.value.total_summa = 0;
};
const showReport = () => {
  const sendData = {
    start_date:
      range_date.value != null
        ? dayJS(range_date.value[0]).format("YYYY-MM-DD")
        : "2023-05-01",
    end_date:
      range_date.value != null
        ? dayJS(range_date.value[1]).format("YYYY-MM-DD")
        : dayJS(new Date().getTime()).format("YYYY-MM-DD"),
    user_id: userId.value,
  };
  loading.value = true;
  ReportService.getByRasxod(sendData).then((res) => {
    getData.value = res;
    loading.value = false;
    summaNol();
    res.forEach((element) => {
      summa_data.value.total_summa += element.rasxod_summa;
    });
    if (res.length == 0) {
      message.warning("Bu davirda ma'lumot mavjud emas ");
    }
  });
};
const tableShow = ref(false);
const exitAction = () => {
  tableShow.value = false;
};
const rasxodTable = ref([]);
const headerData = ref({
  userName: "",
  tableLoading: true,
  tableSum: 0,
});
const tableColumn = ref([
  {
    title: "№",
    key: "id",
    width: 60,
  },
  {
    title: "Sana",
    key: "datetime",
    resizable: true,
  },
  {
    title: "Kimga",
    key: "who_name",
    resizable: true,
  },
  {
    title: "Huquqi",
    key: "who_role",
    resizable: true,
    render(row) {
      if (row.who_role == "User") {
        return "Talaba";
      } else if (row.who_role == "Teacher") {
        return "O'qituvchi";
      } else {
        return row.who_role;
      }
    },
  },
  {
    title: "Sababi",
    key: "becouse_name",
    resizable: true,
  },
  {
    title: "Berilgan summa",
    key: "price",
    resizable: true,
    render(row) {
      return new Intl.NumberFormat("ru-RU", {
        style: "decimal",
      }).format(row.price);
    },
  },
  {
    title: "Izoh",
    key: "comment",
    resizable: true,
  },
]);
const rowProps = (row) => {
  return {
    style: "cursor: pointer;",
    onClick: () => {
      let sendData = {
        start_date:
          range_date.value != null
            ? dayJS(range_date.value[0]).format("YYYY-MM-DD")
            : "2023-05-01",
        end_date:
          range_date.value != null
            ? dayJS(range_date.value[1]).format("YYYY-MM-DD")
            : dayJS(new Date().getTime()).format("YYYY-MM-DD"),
        user_id: row.user_id,
      };
      headerData.value.userName = row.user_name;
      headerData.value.tableSum = row.rasxod_summa;
      ReportService.getByRasxodTable(sendData).then((res) => {
        tableShow.value = true;
        rasxodTable.value = res;
        headerData.value.tableLoading = false;
      });
    },
  };
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Guruh hisoboti</h2>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Sana</n-input-group-label>
            <n-date-picker
              v-model:value="range_date"
              type="daterange"
              :style="{ width: '100%' }"
            />
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Masul shaxs</n-input-group-label>
            <n-select
              :options="userOption"
              v-model:value="userId"
              label-field="fullname"
              value-field="id"
              placeholder="Qidiruv"
              filterable
              clearable
            ></n-select>
          </n-input-group>
        </div>

        <div class="search-action_item">
          <n-button @click="showReport" type="success">Ko'rish</n-button>
        </div>
      </div>
    </div>
    <div class="box-table">
      <n-data-table
        :loading="loading"
        :columns="columns"
        :data="getData"
        :bordered="true"
        :single-line="false"
        size="small"
        :row-props="rowProps"
        max-height="calc(100vh - 350px)"
      >
      </n-data-table>
      <div class="report-result">
        <div class="report-result_item">
          <n-tag
            :bordered="false"
            :color="{ color: '#18a058', textColor: '#fff', paddin: '8px 12px' }"
          >
            Jami summa :
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(summa_data.total_summa)
            }}
          </n-tag>
        </div>
      </div>
    </div>
  </div>
  <n-drawer
    v-model:show="tableShow"
    width="100vw"
    style="height: calc(100vh - 50px)"
    placement="top"
  >
    <n-drawer-content :title="headerData.userName" closable>
      <n-data-table
        :loading="headerData.tableLoading"
        :columns="tableColumn"
        :data="rasxodTable"
        :single-line="false"
        :bordered="false"
      >
      </n-data-table>
      <div class="report-result">
        <div class="report-result_item">
          <n-tag
            :bordered="false"
            :color="{ color: '#18a058', textColor: '#fff', paddin: '8px 12px' }"
          >
            Jami summa :
            {{
              new Intl.NumberFormat("ru-RU", {
                style: "decimal",
              }).format(headerData.tableSum)
            }}
          </n-tag>
        </div>
      </div>
      <template #footer>
        <n-button @click="exitAction" type="warning">
          <template #icon>
            <exit-icon />
          </template>
          Chiqish
        </n-button>
      </template>
    </n-drawer-content>
  </n-drawer>
</template>
