import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useCounterStore = defineStore('counter', () => {
  const theme = ref(false);
  const itemsTranslate = ref([]);
  const coursePlan = ref(false);
  const teacherCourse = ref(false);
  const lesson = ref(false);
  const loadAction = ref(true);
  return {coursePlan, teacherCourse,theme, itemsTranslate, lesson, loadAction}
})
