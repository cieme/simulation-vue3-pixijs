import { createRouter, createWebHistory } from 'vue-router'

import { baseRoutes, afterRoutes } from './routes'
const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [...baseRoutes, ...afterRoutes],
})
export function resetRoutes(callback?: () => void) {
  router.getRoutes().forEach((route) => {
    if (route.name) {
      const existingRoute = router.resolve({ name: route.name })
      if (existingRoute && existingRoute.name) {
        router.removeRoute(existingRoute.name)
      }
    }
  })
  baseRoutes.forEach((route) => {
    router.addRoute(route)
  })
  callback && callback()
}

export default router
