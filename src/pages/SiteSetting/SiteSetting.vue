<script setup>
import { ref, onMounted, inject } from "vue";
import ModelService from "../../services/site.service";
import { Add20Filled as AddIcon } from "@vicons/fluent";
const img_url = inject('img_url');

const data = ref([])
const columns = ref([
    {
        title:'№',
        key: 'id',
    },
    {
        title:'Rasm',
        key:'image',
        resizable: true,
        render(row) {
            if (row.image != "") {
                return h(
                    NImage,
                    {
                        width: 110,
                        height: 50,
                        src: `${img_url}/${row.image}`
                    }
                )
            } else {
                return "Rasm yo'q"
            }
        }
    },
    {
        title:'Sarlovha',
        key: 'title',
        resizable: true,

    },
    {
        title:'Matn',
        key: 'text',
        resizable: true,

    },
    {
        title:'Qator',
        key:'row',
        resizable: true,

    },
    {
        title:'Izoh',
        key:"comment",
        resizable: true,

    }
])
onMounted(()=>{
    ModelService.getAll().then((res)=>{
        res.forEach((item)=>{
            data.value.push(item)
        })
    })
})
</script>
<template>
    <div class="box">
        <div class="box-wrapper">
            <div class="box-header">
                <div class="box-header_item">
                    <h2>Sayt sozlamalari</h2>
                </div>
                <div class="box-header_item">
                    <n-button type="success">
                        <template #icon>
                            <n-icon>
                                <AddIcon/>
                            </n-icon>
                        </template>
                        Sozlamalar qo'shish
                    </n-button>
                </div>
            </div>

        </div>
        <div class="box-table">
            <n-data-table
            :columns="columns"
            :data="data"
            :bordered="false">
            </n-data-table>
        </div>
    </div>
</template>