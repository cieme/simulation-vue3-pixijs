import type { Ref, Reactive } from 'vue'
import { type Spritesheet, Container, Application } from 'pixi.js'
import type { ISourceProps } from '@/components/SceneCore/types/props'

/**
 * 静态资源接口
 *
 * @export
 * @interface IAssets
 * @typedef {IAssets}
 */
export interface IAssets {
  sheet: Spritesheet | null
}
export interface IBaseSceneParams {
  assets: Reactive<IAssets>
  root: Container
  app: Application
  props: unknown
  userData: {
    nodeList: Map<string, Container>
    selectedNodes: Ref<Container[]>
  }
}
/**
 * 通用创建节点参数
 *
 * @export
 * @interface ICreateNodeParams
 * @typedef {ICreateNodeParams}
 */
export interface ICreateNodeParams extends IBaseSceneParams {
  props: ISourceProps
  config: any
}

/**
 * 世界坐标转本地坐标参数
 *
 * @export
 * @interface IGlobalToLocalParams
 * @typedef {IGlobalToLocalParams}
 */
export interface IGlobalToLocalParams {
  globalPoint: { x: number; y: number }
  node: Container
  point?: { x: number; y: number }
  app: Application
}
