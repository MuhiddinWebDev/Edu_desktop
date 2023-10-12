<script setup>
import { DeleteForeverRound as delIcon } from "@vicons/material";

</script>

<template>
  <div
    class="d-flex-btn"
    style="display: flex; align-items: center; justify-content: center">
    <n-button type="error">
      <template #icon>
        <n-icon size="20">
          <delIcon />
        </n-icon>
      </template>
    </n-button>
  </div>
</template>
