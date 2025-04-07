import type { ComputedRef, Reactive, Ref } from 'vue'
import { type Spritesheet, Container, Application } from 'pixi.js'
import type { TComponent, IBaseComponent } from '@/components/SceneCore/types/base'
import type { ILinkParams } from '@/components/SceneCore/types/link'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import NodeItem from '@/components/SceneCore/core/NodeItem'
import type { ENUM_TOOL } from '@/components/SceneCore/mitt/mitt'
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
  props: IBaseProps
  userData: {
    configList: Ref<TComponent[]>
    nodeList: Map<string, NodeItem>
    selectedNodes: ComputedRef<NodeItem[]>
    operationStatus: Ref<ENUM_TOOL>
    linkReactive: ILinkParams
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
  props: IBaseProps
  config: IBaseComponent
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
  root: Container
  point: { x: number; y: number }
  app: Application
}

export interface INodeItem {
  base: Container
  nextLinkNode: Container | null
  prevLinkNode: Container | null
  iconNode: Container | null
  selectNode: Container | null
}
