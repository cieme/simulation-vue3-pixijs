import type { TComponent, ISourceComponent,ITrackComponent } from '@/components/SceneCore/types/base'
export interface IBaseProps {
  Ref_selectedComponent: Map<string, TComponent>
}
export interface ISourceProps extends IBaseProps {
  config: ISourceComponent
}
export interface ITrackProps extends IBaseProps {
  config: ITrackComponent
}


export type AllComponentProps = ISourceProps | ITrackProps
