import { createRouter, createWebHistory } from "vue-router";
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: "/",
      name: "Addmissions",
      redirect: "/login",
      component: () => import("../pages/Admission/Index.vue"),
      children: [
        {
          path: "/main-home",
          name: "main-home",
          component: () => import("../pages/Admission/Home.vue"),
        },
        {
          path: '/main-courses',
          name: 'main-courses',
          component: () => import("../pages/Admission/Courses.vue")
        },
        {
          path: '/main-connect',
          name: 'main-connect',
          component: () => import("../pages/Admission/Connect.vue")
        },

      ],
    },
    {
      path: '/Admin',
      name: 'Admin',
      redirect: '/admin-home',
      component: () => import("../pages/Layouts/Admin.vue"),
      children: [
        {
          path: '/Admin-setting',
          name: 'Asosiy sahifa',
          component: () => import("../pages/Admin/Setting/Setting.vue"),
        },
        {
          path: '/software-setting',
          name: "Dastur to'lovi",
          component: () => import("../pages/Admin/Software/Index.vue"),
        },
        {
          path: '/report-all',
          name: 'Hisobotlar ',
          component: () => import("../pages/Admin/Reports/Index.vue"),
        },

        {
          path: '/Lessons',
          name: 'Darslar',
          component: () => import("../pages/Admin/Lesson/Index.vue"),
        },
        ////////////////////////////////////////// reports start here////////////////////////////////
        {
          path: '/report-attandance',
          name: 'Davomat hisoboti',
          component: () => import("../pages/Admin/Reports/Attandance.vue"),
        },
        {
          path: '/reports-teacher',
          name: "O'qituvchi hisoboti",
          component: () => import("../pages/Admin/Reports/Teacher.vue"),
        },
        {
          path: '/reports-student',
          name: 'Talaba hisoboti',
          component: () => import("../pages/Admin/Reports/Student.vue"),
        },
        {
          path: '/reports-course',
          name: 'Kurs hisoboti',
          component: () => import("../pages/Admin/Reports/Course.vue"),
        },
        {
          path: '/reports-rasxod',
          name: 'Xarajat hisoboti',
          component: () => import("../pages/Admin/Reports/Rasxod.vue"),
        },
        {
          path: '/reports-lesson',
          name: 'Dars hisoboti',
          component: () => import("../pages/Admin/Reports/Lesson.vue"),
        },
        {
          path: '/reports-kassa',
          name: 'Kassa hisoboti',
          component: () => import("../pages/Admin/Reports/Kassa.vue"),
        },
        {
          path: '/reports-group',
          name: 'Guruh hisoboti',
          component: () => import("../pages/Admin/Reports/Group.vue"),
        },
        ////////////////////////////////////////// reports end here////////////////////////////////
        //////////////////////////////////////////////////////////// sverka start here////////////////////////////////
        {
          path: '/sverka-attandance',
          name: 'Davomat sverka',
          component: () => import("../pages/Admin/Sverka/Attandance.vue"),
        },
        {
          path: '/sverka-teacher',
          name: "O'qituvchi sverka",
          component: () => import("../pages/Admin/Sverka/Teacher.vue"),
        },
        {
          path: '/sverka-student',
          name: 'Talaba sverka',
          component: () => import("../pages/Admin/Sverka/Student.vue"),
        },
        {
          path: '/sverka-course',
          name: 'Kurs sverka',
          component: () => import("../pages/Admin/Sverka/Course.vue"),
        },
        {
          path: '/sverka-rasxod',
          name: 'Xarajat sverka',
          component: () => import("../pages/Admin/Sverka/Rasxod.vue"),
        },
        {
          path: '/sverka-lesson',
          name: 'Dars sverka',
          component: () => import("../pages/Admin/Sverka/Lesson.vue"),
        },
        {
          path: '/sverka-kassa',
          name: 'Kassa sverka',
          component: () => import("../pages/Admin/Sverka/Kassa.vue"),
        },
        {
          path: '/sverka-group',
          name: 'Guruh sverka',
          component: () => import("../pages/Admin/Sverka/Group.vue"),
        },
        //////////////////////////////////////////////////////////// sverka end here////////////////////////////////
        {
          path: '/to-attendance',
          name: 'Davomat olish',
          component: () => import("../pages/Admin/ToAttandance/Index.vue"),
        },
        {
          path: '/pay-type',
          name: "To'lov turi",
          component: () => import("../pages/Admin/payType/Index.vue"),
        },
        {
          path: '/branch',
          name: 'Filiallar',
          component: () => import("../pages/Admin/Branch/Index.vue"),
        },
        {
          path: '/salary',
          name: 'Ish haqqi',
          component: () => import("../pages/Admin/Salary/Index.vue"),
        },
        {
          path: '/rooms',
          name: 'Xonalar',
          component: () => import("../pages/Admin/Rooms/Index.vue"),
        },
        {
          path: '/rasxod-becouse',
          name: 'Xarajat sabablari',
          component: () => import("../pages/Admin/RasxodBecouse/Index.vue"),
        },
        {
          path: '/rasxod',
          name: 'Xarajatlar ',
          component: () => import("../pages/Admin/Rasxod/Index.vue"),
        },
        {
          path: '/discounts',
          name: 'Chegirmalar',
          component: () => import("../pages/Admin/Discount/Index.vue"),
        },
        {
          path: '/have-rest',
          name: 'Dam olish',
          component: () => import("../pages/Admin/DayOff/Index.vue"),
        },
        {
          path: '/lesson-table',
          name: 'Dars jadvali',
          component: () => import("../pages/Admin/LessonTable/Index.vue"),
        },
        {
          path: '/admin-home',
          name: 'Bosh sahifa',
          component: () => import("../pages/Admin/AdminHome/Index.vue"),
        },
        {
          path: '/email-messages',
          name: 'Xabarlar',
          component: () => import("../pages/Admin/Messages/Index.vue"),
        },
        {
          path: '/quiz',
          name: 'Savol-Javob',
          component: () => import("../pages/Admin/Quiz/Index.vue"),
        },
        {
          path: '/payment-students',
          name: "Talabalar to'lovi",
          component: () => import("../pages/Admin/PaymentStudent/Index.vue"),
        },
        {
          path: '/payment-teacher',
          name: "O'qituvchilar to'lovi",
          component: () => import("../pages/Admin/PaymentTeacher/Index.vue"),
        },
        {
          path: '/payment-employees',
          name: "Xodimlar to'lovi",
          component: () => import("../pages/Admin/PaymentEmployee/Index.vue"),
        },
        {
          path: '/users',
          name: 'Foydalanuvchilar',
          component: () => import("../pages/Admin/Users/Index.vue"),
        },
        {
          path: '/students',
          name: 'Talabalar',
          component: () => import("../pages/Admin/Student/Index.vue"),
        },
        {
          path: '/student-parents',
          name: 'Ota onalar',
          component: () => import("../pages/Admin/StudentParents/Index.vue"),
        },
        {
          path: '/teachers',
          name: "O'qituvchilar",
          component: () => import("../pages/Admin/Teacher/Index.vue"),
        },
        {
          path: '/admins',
          name: 'Adminlar',
          component: () => import("../pages/Admin/Worker/Index.vue"),
        },
        {
          path: '/groups',
          name: 'Guruhlar',
          component: () => import("../pages/Admin/Groups/Index.vue"),
        },
        {
          path: '/courses',
          name: 'Kurslar',
          component: () => import("../pages/Admin/Courses/Index.vue"),
        }
      ]
    },
    {
      path: '/User',
      name: 'User',
      component: () => import("../pages/Layouts/User.vue"),
      children: [
        // {
        //   path:'/admin-home',
        //   name:'Admin-home',
        //   component: () => import("../pages/Admin/AdminHome/Index.vue"),
        // }
      ]
    },
    {
      path: '/teacher',
      name: 'Teacher',
      redirect: "/teacher-lesson-table",
      component: () => import("../pages/Layouts/Teacher.vue"),
      children: [
        {
          path: '/teacher-home',
          name: 'Teacher-home',
          component: () => import("../pages/Teacher/Home/Index.vue"),
        },
        {
          path: '/teacher-money',
          name: 'Oyliklarim',
          component: () => import("../pages/Teacher/TeacherMonth/Index.vue"),
        },
        {
          path: '/teacher-lesson',
          name: "Darslarim",
          component: () => import("../pages/Teacher/Lesson/Index.vue"),
        },
        {
          path: '/teacher-lesson-table',
          name: "Dars jadvalim",
          component: () => import("../pages/Teacher/LessonTable/Index.vue"),
        },
        {
          path: '/teacher-course',
          name: "Kurslarim",
          component: () => import("../pages/Teacher/Course/Index.vue"),
        },
        {
          path: '/teacher-salary',
          name: "Ish haqqim",
          component: () => import("../pages/Teacher/Salary/Index.vue"),
        },
        {
          path: '/teacher-attandance',
          name: "Davomat_ olish",
          component: () => import("../pages/Teacher/ToAttandance/Index.vue"),
        },
        {
          path: '/teacher-dayoff',
          name: "Dam olish kunlari",
          component: () => import("../pages/Teacher/DayOff/Index.vue"),
        }
      ]
    },
    {
      path: '/CRM',
      name: "CRM",
      component: () => import("../pages/Admin/CRM/Index.vue"),
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("../pages/Log/LoginIndex.vue"),
    },
    {
      path: '/software-payment',
      name: "Software Payment",
      component: () => import("../pages/Layouts/Software.vue"),
    },

  ],
});

router.beforeEach((to, from, next) => {
  const publicPages = ['/Login']
  const authRequired = !publicPages.includes(to.path)
  const loggedIn = localStorage.getItem('token')
  const role = localStorage.getItem('role');
  // trying to access a restricted page + not logged in
  // redirect to login page
  if (authRequired && !loggedIn && to.path != '/software-payment') {
    next('/Login');
  }
  else {
    next();
  }
})
export default router;
