import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import service from '@/utils/request/request'
import { type IResponse } from '@/utils/request/types'
import { type IListResult } from '@/api/types/types'
import { type ISceneParams, type ISceneItem } from '@/api/types/scene_types'

export function APGetSceneList(
  data: ISceneParams,
  config?: AxiosRequestConfig,
): Promise<IListResult<Array<ISceneItem>>> {
  return service.post('/api/scene/page', data, config)
}
