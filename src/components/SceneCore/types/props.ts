export interface IBaseComponent {
  selectedComponent: { id: string; label: string }[]
}
export interface ISourceProps extends IBaseComponent {
  config: object
}
