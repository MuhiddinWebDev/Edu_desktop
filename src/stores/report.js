import { ref, computed } from 'vue'
import { defineStore } from 'pinia'

export const useReportData = defineStore('report', () => {
  const rasxodPass = ref({
    id: null,
    read: false
  });
  const studentPass = ref({
    id: null,
    read: false
  });
  const teacherPass = ref({
    id: null,
    read: false
  })
  const attandancePass = ref({
    id: null,
    read: false
  })
  const teacherSverka = ref({
    range_date: null,
    teacher_id: null,
    filial_id: null,
    show: false,
  });
  const studentSverka = ref({
    range_date: null,
    student_id: null,
    filial_id: null,
    show: false,
  });
  const courseSverka = ref({
    range_date: null,
    course_id: null,
    filial_id: null,
    show: false,
  })
  const attandanceSverka = ref({
    range_date: null,
    group_id: null,
    teacher_id: null,
    filial_id: null,
    show: false,
  }); 
  const lessonSverka = ref({
    range_date: null,
    group_id: null,
    teacher_id: null,
    filial_id: null,
    show: false,
  }); 
  return {
    rasxodPass,
    studentPass,
    teacherPass, 
    attandancePass,
    teacherSverka, 
    studentSverka, 
    courseSverka,
    attandanceSverka,
    lessonSverka
  }
})
