import type { ComputedRef, Reactive, Ref } from 'vue'
import type { Spritesheet, Container, Application, PointData, BitmapFont } from 'pixi.js'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
  ITrackComponent,
} from '@/components/SceneCore/types/base'
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
  font: BitmapFont | null
  isLoaded: boolean
}
export interface IBaseSceneParams {
  userData: {
    assets: Reactive<IAssets>
    root: Container
    app: Application
    trackManagerNode: Container
    trackLabelManagerNode: Container
    /* 组件配置列表 */
    Ref_M_configList: Ref<Map<string, TComponent>>
    /* 选中的组件配置 */
    Ref_selectedComponent: Ref<Map<string, TComponent>>
    /* 选中的组件数量 */
    Com_selectComponentLength: ComputedRef<number>
    /* 节点列表,用来获取某些节点 */
    M_nodeList: Map<string, NodeItem>
    /* 选中的节点 */
    Com_M_selectedNodes: ComputedRef<Map<string, NodeItem>>
    /* 当前操作状态 */
    Ref_operationStatus: Ref<ENUM_TOOL>
    /* 缩放比例 */
    Ref_scale: Ref<PointData>
    /* 选中的连接线 */
    Ins_currentLink: Link | null
    /* 组件连接模块 */
    linkModule: ILinkParams
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
