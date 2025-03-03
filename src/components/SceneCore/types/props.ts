export interface IBaseComponent {
  config: object
  selectedComponent: { id: string; label: string }[]
}
export interface ISourceProps extends IBaseComponent {}
