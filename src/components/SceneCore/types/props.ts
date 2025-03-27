import { type TComponentType } from '@SceneCore/types/components'
export interface IBaseComponent {
  selectedComponent: { id: string; label: string; type: TComponentType }[]
}
export interface ISourceProps extends IBaseComponent {
  config: object
}
