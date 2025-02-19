import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import service from '@/utils/request/request'
import { type IResponse } from '@/utils/request/types'
import { type ILoginParams, type ILoginResponse } from '@/api/user/types'
export function APLogin(
  data: ILoginParams,
  config?: AxiosRequestConfig,
): Promise<IResponse<ILoginResponse>> {
  return service.post('/api/user/login', data, config)
}
