import type { IBaseComponent, ISourceComponent } from '@/components/SceneCore/types/base'
export interface IBaseProps {
  selectedComponent: IBaseComponent[]
}
export interface ISourceProps extends IBaseProps {
  config: ISourceComponent
}


export type AllComponentProps = ISourceProps
