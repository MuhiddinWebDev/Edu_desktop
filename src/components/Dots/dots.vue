<script setup>
import {ref} from 'vue';
const theme = ref( JSON.parse(localStorage.getItem('theme')));
</script>
<template>
    <div class="dots">
        <div class="dots-item" :class="theme ? 'bg-black':'bg-white' "></div>
        <div class="dots-item" :class="theme ? 'bg-black':'bg-white' "></div>
        <div class="dots-item" :class="theme ? 'bg-black':'bg-white' "></div>
    </div>
</template>

<style scoped>
.dots{
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 3px;
}
.dots-item{
    padding: 2px;
    border-radius: 50%;

}
.bg-black{
    background: rgba(39, 36, 36, 0.87);
}
.bg-white{
    background: white;
}
</style>