<script setup>
import Dots from "../../../components/Dots/dots.vue";
</script>
<template>
  <div>
    <n-tooltip placement="right" trigger="hover">
      <template #trigger>
        <n-button type="success" :style="{ padding: '0px 8px' }">
          <template #icon>
            <Dots />
          </template>
        </n-button>
      </template>
      <span> O'qituvchi qo'shish </span>
    </n-tooltip>
  </div>
</template>
