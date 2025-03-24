import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
export function hasSelectedComponent(
  props: ICreateNodeParams['props'],
  item: ICreateNodeParams['props']['selectedComponent'][0],
) {
  return props.selectedComponent.some((componentItem) => componentItem.id === item.id)
}

export function addSelectedComponent(
  props: ICreateNodeParams['props'],
  item: ICreateNodeParams['props']['selectedComponent'][0],
  needClear: boolean = false,
) {
  if (hasSelectedComponent(props, item)) {
    return
  }
  if (needClear) {
    props.selectedComponent.length = 0
  }
  props.selectedComponent.push(item)
}
