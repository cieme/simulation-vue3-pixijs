const KEY = 'USER_INFO'
import JScookie from 'js-cookie'
import { type ILoginResponse } from '@/api/user/types'
export const setCookie = (value: ILoginResponse): void => {
  JScookie.set(KEY, JSON.stringify(value), {
    expires: 7, // 7 days
  })
}
export const getCookie = (): ILoginResponse | undefined => {
  const value = JScookie.get(KEY)
  return value ? JSON.parse(value) : undefined
}
export const removeCookie = (): void => {
  JScookie.remove(KEY)
}
