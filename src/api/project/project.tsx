import { type AxiosRequestConfig, type AxiosResponse } from 'axios'
import service from '@/utils/request/request'
import { type IResponse } from '@/utils/request/types'
import { type IListResult } from '@/api/types/types'
import { type IProject, type IProjectScene } from '@/api/types/project_types'

export function APGetProjectList(
  data: IProject,
  config?: AxiosRequestConfig,
): Promise<IListResult<Array<IProjectScene>>> {
  return service.post('/api/project/page', data, config)
}
