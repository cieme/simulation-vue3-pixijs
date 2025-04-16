import type { ComputedRef, Reactive, Ref } from 'vue'
import { type Spritesheet, Container, Application, type PointData } from 'pixi.js'
import type { TComponent, IBaseComponent,ISourceComponent,ITrackComponent } from '@/components/SceneCore/types/base'
import type { ILinkParams } from '@/components/SceneCore/types/link'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import NodeItem from '@/components/SceneCore/core/NodeItem'
import type { ENUM_TOOL } from '@/components/SceneCore/mitt/mitt'
import { Link } from '@/components/SceneCore/link/Link'
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
  userData: {
    currentLink: Link | null
    selectedComponent: Ref<IBaseComponent[]>
    selectComponentLength: ComputedRef<number>
    configList: Ref<TComponent[]>
    nodeList: Map<string, NodeItem>
    selectedNodes: ComputedRef<NodeItem[]>
    operationStatus: Ref<ENUM_TOOL>
    linkReactive: ILinkParams
    refScale: Ref<PointData>
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
  config: TComponent
}

/**
 * 创建源节点参数
 *
 * @export
 * @interface ICreateSourceParams
 * @typedef {ICreateSourceParams}
 * @extends {IBaseSceneParams}
 */
export interface ICreateSourceParams extends IBaseSceneParams {
  props: IBaseProps
  config: ISourceComponent
}
/**
 * 创建轨道节点参数
 *
 * @export
 * @interface ICreateNodeParams
 * @typedef {ICreateNodeParams}
 */
export interface ICreateTrackParams extends IBaseSceneParams {
  props: IBaseProps
  config: ITrackComponent
}
