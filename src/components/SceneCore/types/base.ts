import type { PointData } from 'pixi.js'
import { type E_COMPONENT_TYPE } from '@/components/SceneCore/enum'

export interface IBaseComponent {
  id: string
  label: string
  type: E_COMPONENT_TYPE
  position: PointData
}
export interface ISelectedComponent {
  id: IBaseComponent['id']
}
export interface ISourceComponent extends IBaseComponent {
  createTime: string
}
export interface ITrackComponent extends IBaseComponent {
  points: PointData[]
}

export type TComponent = IBaseComponent | ISourceComponent | ITrackComponent
// export type TComponent = ISourceComponent | ITrackComponent
