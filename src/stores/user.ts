import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type ILoginResponse } from '@/api/types/user_types'
import { getCookie, setCookie, removeCookie } from '@/utils/auth/auth'
export const useUserStore = defineStore('userStore', () => {
  const cookie = getCookie()
  const defaultInfo = () => {
    return {
      dbId: '',
      roleLevel: '',
      realName: '',
    }
  }
  const userInfo = ref<ILoginResponse>(defaultInfo())
  if (cookie) {
    userInfo.value = cookie
  }
  const isLogin = computed(() => {
    return !!userInfo.value.dbId
  })
  const setUserInfo = (value: ILoginResponse) => {
    userInfo.value = value
    setCookie(value)
  }
  const logout = () => {
    userInfo.value = defaultInfo()
    removeCookie()
  }

  return { userInfo, isLogin, setUserInfo, logout }
})
