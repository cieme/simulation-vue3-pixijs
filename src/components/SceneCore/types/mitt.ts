import { E_EVENT_SCENE } from '@SceneCore/enum/mitt'
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
  width: number
  height: number
}
export type MittEvents = {
  [E_EVENT_SCENE.BoxSelection]: IBoxSelectionEvent
}
