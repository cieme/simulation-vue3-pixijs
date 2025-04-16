import type { IBaseComponent, ISourceComponent,ITrackComponent } from '@/components/SceneCore/types/base'
export interface IBaseProps {
  selectedComponent: IBaseComponent[]
}
export interface ISourceProps extends IBaseProps {
  config: ISourceComponent
}
export interface ITrackProps extends IBaseProps {
  config: ITrackComponent
}


export type AllComponentProps = ISourceProps
