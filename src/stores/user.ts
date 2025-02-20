import { ref, computed } from 'vue'
import { defineStore } from 'pinia'
import { type ILoginResponse } from '@/api/user/types'
import { getCookie, setCookie } from '@/utils/auth/auth'
export const useUserStore = defineStore('userStore', () => {
  const cookie = getCookie()
  const userInfo = ref<ILoginResponse>({
    dbId: '',
    roleLevel: '',
    realName: '',
  })
  if (cookie) {
    userInfo.value = cookie
  }

  const setUserInfo = (value: ILoginResponse) => {
    userInfo.value = value
    setCookie(value)
  }

  return { userInfo, setUserInfo }
})
