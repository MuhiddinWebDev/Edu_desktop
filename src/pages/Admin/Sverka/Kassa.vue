<script setup>
import { ref, onMounted, inject, h, defineComponent } from "vue";
import { useRouter } from "vue-router";
import ReportService from "../../../services/report.service";
import PayTypeService from "../../../services/payType.service";
import BranchService from "../../../services/branch.service";
import { useReportData } from "../../../stores/report";

const findRole = ref(localStorage.getItem("role"));

const branchOption = ref([]);
const payTypeOption = ref([]);
const router = useRouter();
const reportAct = useReportData();

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

const searchData = ref({
  start_date: Math.floor(range_date.value[0] / 1000),
  end_date: Math.floor(range_date.value[1] / 1000),
  pay_type_id: null,
  filial_id: JSON.parse(localStorage.getItem("filial_id")),
});

const showReport = () => {
  loading.value = true;

  ReportService.kassaSverka(searchData.value).then((res) => {
    reportData.value = res;
    loading.value = false;
  });
};

const rowProps = (row) => {
  if(row.place == 'Xarajatlar'){
    reportAct.rasxodPass = {
      id: row.doc_id,
      read: true
    }
    router.push({ path:'/rasxod'})
  }else if(row.place == "Talaba to'lovi"){
    reportAct.studentPass = {
      id: row.doc_id,
      read: true
    }
    router.push({ path:'/payment-students'});
  }else if(row.place =="O'qituvchiga to'lov"){
    reportAct.teacherPass = {
      id: row.doc_id,
      read: true
    }
    router.push({ path:'/payment-teacher'});
  }
};
</script>
<template>
  <div class="box">
    <div class="box-wrapper">
      <div class="box-header">
        <div class="box-header_item">
          <h2>Kassa sverka</h2>
        </div>
      </div>
      <div class="search-action">
        <div class="search-action_item">
          <n-input-group>
            <n-input-group-label>Sana</n-input-group-label>
            <n-date-picker
              v-model:value="range_date"
              type="daterange"
              clearable
              :style="{width:'100%'}"
            />
          </n-input-group>
        </div>
        <div class="search-action_item" v-if="findRole == 'SuperAdmin'">
          <n-input-group>
            <n-input-group-label>Filial</n-input-group-label>
            <n-select
              :options="branchOption"
              v-model:value="searchData.filial_id"
              label-field="name"
              value-field="id"
              placeholder="Qidiruv"
              filterable
            ></n-select>
          </n-input-group>
        </div>
        <div class="search-action_item">
          <n-input-group style="width: 100%;">
            <n-input-group-label>To'lov turi</n-input-group-label>
            <n-select
              :options="payTypeOption"
              v-model:value="searchData.pay_type_id"
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
      <n-table :bordered="true" :single-line="false" size="small" style="min-width: 820px;">
        <thead>
          <tr>
            <th style="width: 50px">№</th>
            <th>Sana</th>
            <th>Nomi</th>
            <th>To'lov turi</th>
            <th>Izoh</th>
            <th class="color-black background-success">Kirim</th>
            <th class="color-black background-error">Chiqim</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td class="text-center text-bold" colspan="5">
              {{ dayJS(range_date[0]).format("YYYY-MM-DD HH:mm:ss") }} dagi
              boshlang'ich qoldiq
            </td>
            <td class="text-center text-bold" colspan="3">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.begin_total ? reportData.begin_total : 0)
              }}
            </td>
          </tr>
          <tr
            class="report-data-row"
            v-for="(item, index) in reportData.data"
            :key="index"
            @dblclick="rowProps(item)"
          >
            <td style="width: 50px">{{ index + 1 }}</td>
            <td>
              {{ dayJS(item.datetime * 1000).format("YYYY-MM-DD HH:mm:ss") }}
            </td>
            <td>№{{ item.doc_id }} {{ item.doc_type }} {{ item.place }}</td>
            <td>{{ item.pay_type ? item.pay_type.name : "Yo'q" }}</td>
            <td>{{ item.comment }}</td>
            <td class="text-right color-black background-success">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(item.kirim)
              }}
            </td>
            <td class="text-right color-black background-error">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(item.chiqim)
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="5">Jami</td>
            <td class="text-right text-bold color-black background-success">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.all_kirim ? reportData.all_kirim : 0)
              }}
            </td>
            <td class="text-right text-bold color-black background-error">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.all_chiqim ? reportData.all_chiqim : 0)
              }}
            </td>
          </tr>
          <tr>
            <td class="text-center text-bold" colspan="5">
              {{ dayJS(range_date[1]).format("YYYY-MM-DD HH:mm:ss") }} dagi
              yakuniy qoldiq
            </td>
            <td class="text-center text-bold" colspan="3">
              {{
                Intl.NumberFormat("ru-RU", {
                  style: "decimal",
                  minimumFractionDigits: 2,
                }).format(reportData.end_total ? reportData.end_total : 0)
              }}
            </td>
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
