import { createRouter, createWebHistory } from 'vue-router'
import StudentsListView from '@/views/students/StudentsListView.vue'
import StudentFormView from '@/views/students/StudentFormView.vue'
import LoginView from '@/views/students/LoginView.vue'
import { useAuthStore } from '@/stores/auth'

export const baseRoute = '/students'

export const studentRoutePaths = {
  list: baseRoute,
  create: `${baseRoute}/new`,
  edit: (ra: string) => `${baseRoute}/${encodeURIComponent(ra)}/edit`,
} as const

export const studentsRoutes = [
  {
    path: baseRoute,
    component: StudentsListView,
    meta: { requiresAuth: true, permissions: ['students:read'] },
  },
  {
    path: `${baseRoute}/new`,
    component: StudentFormView,
    meta: { requiresAuth: true, permissions: ['students:create'] },
  },
  {
    path: `${baseRoute}/:ra/edit`,
    component: StudentFormView,
    props: true,
    meta: { requiresAuth: true, permissions: ['students:create'] },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes: [
    { path: '/', redirect: baseRoute },
    { path: '/login', name: 'login', component: LoginView, meta: { guestOnly: true } },
    ...studentsRoutes,
    { path: '/:pathMatch(.*)*', redirect: baseRoute },
  ],
})

router.beforeEach((to) => {
  const auth = useAuthStore()
  if (!auth.loaded) auth.hydrate()

  if (to.meta.requiresAuth && !auth.isAuthenticated) {
    return { name: 'login', query: { redirect: to.fullPath } }
  }

  if (to.meta.guestOnly && auth.isAuthenticated) {
    return { path: (to.query.redirect as string) || baseRoute }
  }

  const requiredPermsRaw = (to.meta?.permissions as string[] | string | undefined)
  const requiredPerms = Array.isArray(requiredPermsRaw) ? requiredPermsRaw : requiredPermsRaw ? [requiredPermsRaw] : []
  if (requiredPerms.length) {
    const userPerms = auth.user?.permissions ?? []
    const ok = requiredPerms.some((p) => userPerms.includes(p))
    if (!ok) {
      if (userPerms.includes('students:create')) return { path: studentRoutePaths.create }
      if (userPerms.includes('students:read')) return { path: studentRoutePaths.list }
      return { name: 'login' }
    }
  }

  return true
})

export default router
