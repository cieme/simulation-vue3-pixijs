import axios, { type AxiosResponse, HttpStatusCode } from 'axios'
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
    }
    return Promise.reject(new Error(response.data.msg || 'Error'))
  } else {
    console.error('Error', response.data)
    return Promise.reject(new Error(response.data.msg || 'Error'))
  }
})
export default service
