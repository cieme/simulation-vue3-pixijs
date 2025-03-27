import type { PointData } from 'pixi.js'
import { type TComponentType } from '@/components/SceneCore/types/components'

export interface IBaseComponent {
  id: string
  label: string
  type: TComponentType
  position: PointData
}
export interface ISelectedComponent {
  id: IBaseComponent['id']
}
export interface ISourceComponent extends IBaseComponent {
  createTime: string
}

export type TComponent = IBaseComponent | ISourceComponent
