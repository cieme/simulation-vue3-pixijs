import { Container, Application, type PointData } from 'pixi.js'
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
  node: Container
  nextLinkNode: Container | null
  prevLinkNode: Container | null
  iconNode: Container | null
  selectNode: Container | null
}

