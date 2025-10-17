import { createRouter, createWebHistory } from 'vue-router'
import StudentsListView from '@/views/students/StudentsListView.vue'
import StudentFormView from '@/views/students/StudentFormView.vue'

export const baseRoute = '/users' as const

export const studentsRoutes = [
  {
    path: baseRoute,
    component: StudentsListView,
  },
  {
    path: `${baseRoute}/new`,
    component: StudentFormView,
  },
  {
    path: `${baseRoute}/:ra/edit`,
    component: StudentFormView,
    props: true,
  },
]

export default createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: baseRoute },
    ...studentsRoutes,
  ],
})
