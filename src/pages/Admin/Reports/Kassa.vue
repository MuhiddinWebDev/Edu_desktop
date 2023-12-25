<script setup>
import { ref, onMounted, inject, h, defineComponent } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import PayTypeService from "../../../services/payType.service";
import BranchService from "../../../services/branch.service";
//// report variables
const payTypeId = ref(null);
const branchId = ref(JSON.parse(localStorage.getItem("filial_id")));
const branchOption = ref([]);
const payTypeOption = ref([]);
const router = useRouter();

const getAllBranches = () => {
  BranchService.getAll().then((res) => {
    branchOption.value = res;
  });
};
const getAllPayType = () => {
  PayTypeService.getAll().then((res) => {
    payTypeOption.value = res;
  });
};
const time_def = ref(new Date());
const thisMonth = ref(
  new Date(time_def.value.getFullYear(), time_def.value.getMonth())
);
const range_date = ref([thisMonth.value.getTime(), time_def.value.getTime()]);
///// table veribles
const loading = ref(false);
const reportData = ref([]);
const dayJS = inject("dayJS");
///// table veribles
onMounted(() => {
  getAllBranches();
  getAllPayType();
});

const showReport = () => {
  const sendData = {
    start_date: Math.floor(range_date.value[0] / 1000),
    end_date: Math.floor(range_date.value[1] / 1000),
    pay_type_id: payTypeId.value,
    filial_id: branchId.value,
  };
  loading.value = true;
  ReportService.kassaReport(sendData).then((res) => {
    reportData.value = res;
    loading.value = false;
  });
};

const rowProps = (row) => {
  if (row.place == "Xarajatlar") {
    router.push({ name: "Xarajatlar" });
  }
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Kassa hisobot</h2>
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
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              :options="branchOption"
              v-model:value="branchId"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>To'lov turi</n-input-group-label>
            <n-select
              :options="payTypeOption"
              v-model:value="payTypeId"
              label-field="name"
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
      <n-table :bordered="true" :single-line="false" size="small">
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th>Nomi</th>
            <th>To'lov turi</th>
            <th>Kirim</th>
            <th>Chiqim</th>
            <th>Jami</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center text-bold" colspan="3">
              Boshlang'ich summa
            </td>
            <td class="text-center text-bold" colspan="2">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.begin_total ? reportData.begin_total : 0)
              }}
            </td>
            <td></td>
          </tr>
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td style="width: 50px">{{ index + 1 }}</td>
            <td>{{ item.place }}</td>
            <td>{{ item.pay_type.name }}</td>
            <td class="text-right">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(item.kirim)
              }}
            </td>
            <td class="text-right">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(item.chiqim)
              }}
            </td>
            <td class="text-right text-bold">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(item.kirim - item.chiqim)
              }}
            </td>
          </tr>
          <tr>
            <td colspan="3" class="text-center text-bold">Jami</td>
            <td class="text-right text-bold">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.all_kirim ? reportData.all_kirim : 0)
              }}
            </td>
            <td class="text-right text-bold">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.all_chiqim ? reportData.all_chiqim : 0)
              }}
            </td>
            <td class="text-right text-bold">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(
                  reportData.all_chiqim && reportData.all_kirim
                    ? reportData.all_kirim - reportData.all_chiqim
                    : 0
                )
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="3">Yakuniy summa</td>
            <td class="text-center text-bold" colspan="2">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.end_total ? reportData.end_total : 0)
              }}
            </td>
            <td></td>
          </tr>
        </tbody>
      </n-table>
    </div>
  </div>
</template>

<style>
.report-data-row {
  cursor: pointer;
}
</style>
