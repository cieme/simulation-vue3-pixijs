import { E_EVENT_SCENE, ENUM_TOOL } from '@/components/SceneCore/enum'
import type { Point, PointData } from 'pixi.js'
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
  [E_EVENT_SCENE.BoxSelection]: IBoxSelectionEvent
  [E_EVENT_SCENE.SCENE_OPERATION_STATUS]: ENUM_TOOL
}
