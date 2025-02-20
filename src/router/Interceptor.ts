import type {
  RouteLocationNormalized,
  RouteLocationNormalizedLoaded,
  NavigationGuardNext,
} from 'vue-router'
import { useUserStore } from '@/stores/user'
import router from '.'
router.beforeEach(
  (to: RouteLocationNormalized, from: RouteLocationNormalizedLoaded, next: NavigationGuardNext) => {
    const userStore = useUserStore()
    if (!userStore.isLogin) {
      if (to.name !== 'login') {
        next({ name: 'login' })
      } else {
        next()
      }
    } else {
      if (to.name == 'login') {
        next({ path: '/', replace: true })
      } else {
        next()
      }
    }
  },
)
