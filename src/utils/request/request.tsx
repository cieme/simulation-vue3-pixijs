import axios, { type AxiosResponse, HttpStatusCode } from 'axios'
import router from '@/router/index'
import { message } from 'ant-design-vue'
import { type IResponse } from './types'
import { useUserStore } from '@/stores/user'

const service = axios.create({
  baseURL: import.meta.env.VITE_APP_BASEURL + import.meta.env.VITE_APP_PREFIX,
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  },
  transformResponse: [
    (data) => {
      try {
        return JSON.parse(data)
      } catch (error) {
        return data
      }
    },
  ],
  transformRequest: [
    (data) => {
      if (typeof data === 'object' && data !== null) {
        return JSON.stringify(data)
      }
      return data
    },
  ],
  validateStatus: (status) => {
    return (
      (status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices) ||
      status === HttpStatusCode.Unauthorized
    )
  },
  withCredentials: true, // 跨域请求时是否需要使用凭证
})
service.interceptors.request.use((config) => {
  const userStore = useUserStore()
  if (userStore.isLogin) {
    config.headers['Authorization'] = userStore.userInfo.dbId
  }
  return config
})

service.interceptors.response.use((response: AxiosResponse<IResponse<any>>): any => {
  const status = response.status
  if (status >= HttpStatusCode.Ok && status < HttpStatusCode.MultipleChoices) {
    if (response.data.code === HttpStatusCode.Ok) {
      return response.data
    } else if (response.data.code === HttpStatusCode.Unauthorized) {
      const userStore = useUserStore()
      userStore.logout()
      router.push({ name: 'login' })
      return Promise.reject(showMessage(response.data))
    }
    return Promise.reject(showMessage(response.data))
  } else {
    console.error('Error', response.data)
    return Promise.reject(showMessage(response.data))
  }
})
export default service

export const showMessage = (e: any) => {
  let text: string = '系统错误'
  if (typeof e === 'object') {
    text = e?.message || e?.msg || e?.data?.msg
  } else if (typeof e === 'string') {
    text = e.trim()
  }

  message.error(text)
  return text
}
