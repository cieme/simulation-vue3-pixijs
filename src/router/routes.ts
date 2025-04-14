import HomeView from '../views/Project/Project.vue'
import { type RouteRecordRaw } from 'vue-router'
export const baseRoutes: RouteRecordRaw[] = [
  {
    path: '/',
    name: 'home',
    component: HomeView,
  },
  {
    path: '/scene',
    name: 'scene',
    component: () => import('../views/Scene/Scene.vue'),
  },
  {
    path: '/about',
    name: 'about',
    component: () => import('../views/About/about.vue'),
  },
  {
    path: '/login',
    name: 'login',
    component: () => import('../views/Login/Login.vue'),
  },
  {
    path:'/test',
    name:'test',
    component: () => import('../views/Test/test.vue'),
  }
]
export const afterRoutes: RouteRecordRaw[] = [
  {
    path: '/404',
    name: 'not-found',
    component: () => import('@/views/PageErrors/NotFoundView.vue'),
  },
  {
    path: '/:pathMatch(.*)*',
    name: 'common',
    redirect: (to) => {
      return { path: '/404' }
    },
  },
]
