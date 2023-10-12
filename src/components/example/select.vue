<script setup>

</script>
<template>
  <n-input-group>
    <n-select
      @keydown="teacherKey"
      @search="TeacherSearch"
      v-model:value="form_data.teacher_id"
      :options="teacherList"
      label-field="fullname"
      value-field="id"
      filterable
      :render-label="renderUser"
      :render-tag="renderUserTag"
      clearable
    >
      <template #action>
        <p style="text-align: center">Ro'yxatni ko'rish "F4"</p>
      </template>
      <template #empty>
        <p style="text-align: center">Qo'shish uchun "Insert"</p>
      </template>
    </n-select>
    <n-tooltip placement="right" trigger="hover">
      <template #trigger>
        <n-button
          type="success"
          :style="{ padding: '0px 8px' }"
        >
          <template #icon>
            <Dots />
          </template>
        </n-button>
      </template>
      <span> O'qituvchi qo'shish </span>
    </n-tooltip>
  </n-input-group>
</template>
