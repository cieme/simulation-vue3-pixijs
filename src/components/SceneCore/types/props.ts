import { type TComponentType } from '@SceneCore/types/components'
export interface IBaseComponent {
  selectedComponent: {
    id: string
    label: string
    type: TComponentType
    position: { x: number; y: number }
  }[]
}

export interface ISourceProps extends IBaseComponent {
  config: object
}
