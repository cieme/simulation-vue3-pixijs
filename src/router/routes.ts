import HomeView from '../views/Project/Project.vue'
import { type RouteRecordRaw } from 'vue-router'
export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/Login.vue'),
  },
]
export const afterRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'common',
    redirect: (to) => {
      return { path: '/404' }
    },
  },
]
