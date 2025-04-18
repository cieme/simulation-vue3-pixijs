import { Container, Application, type PointData } from 'pixi.js'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'
/**
 * 世界坐标转本地坐标参数
 *
 * @export
 * @interface IGlobalToLocalParams
 * @typedef {IGlobalToLocalParams}
 */
export interface IGlobalToLocalParams {
  globalPoint: PointData
  node: Container
  root: Container
  point: PointData
  app: Application
}

export interface INodeItem {
  id: string
  type: E_COMPONENT_TYPE
  node: Container
  nextLinkNode: Container | null
  prevLinkNode: Container | null
  iconNode: Container | null
  selectNode: Container | null
}
