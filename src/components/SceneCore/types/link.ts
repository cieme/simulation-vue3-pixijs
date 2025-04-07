import { type PointData } from 'pixi.js'
import type { IBaseComponent } from '@/components/SceneCore/types/base'
import { Link } from '@/components/SceneCore/link/Link'
import { ENUM_LINK_TYPE } from '../mitt/mitt'
export type T_LINK_TYPE = 'prev' | 'next'
export interface ILink {
  uniqueId: string
  start: string
  end?: string
  /* 连接类型-起点类型 */
  linkType: T_LINK_TYPE
  /*连接点*/
  point: Array<PointData>
  /* 链接中的坐标,鼠标移动 */
  linking?: PointData
  /* 配置 */
  config?: PointData
  /**
   * 接口入口id
   */
  interfaceEnterId?: string
  /**
   * 接口出口Id
   */
  interfaceExitId?: string
}
export interface ILinkParams {
  status: ENUM_LINK_TYPE | null
  startComponentConfig: IBaseComponent | null
  linking: Link | null
  LinkData: Link[]
  reset: () => void
}
