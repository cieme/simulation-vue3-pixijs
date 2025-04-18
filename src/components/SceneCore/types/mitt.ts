import { E_EVENT_SCENE, ENUM_TOOL, ENUM_LINK_TYPE } from '@/components/SceneCore/enum'
import type { FederatedPointerEvent, PointData } from 'pixi.js'
/**
 * 框选事件
 *
 * @interface IBoxSelectionEvent
 * @typedef {IBoxSelectionEvent}
 */
interface IBoxSelectionEvent {
  startPoint: PointData
  endPoint: PointData
  startGlobalPoint: PointData
  endGlobalPoint: PointData
  width: number
  height: number
}
export type MittEvents = {
  [E_EVENT_SCENE.BOX_SELECTION]: IBoxSelectionEvent
  [E_EVENT_SCENE.SCENE_OPERATION_STATUS]: ENUM_TOOL
  [E_EVENT_SCENE.LINK_STATUS]: ENUM_LINK_TYPE
  [E_EVENT_SCENE.MOVE_COMPONENT]: string[] // 移动组件 id
  [E_EVENT_SCENE.MOVE_LINK]: string // 连接线 id
  [E_EVENT_SCENE.MOUSE_DOWN_SCENE]: FederatedPointerEvent
}
