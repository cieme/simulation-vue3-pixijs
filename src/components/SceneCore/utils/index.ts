import type { TComponent } from '@/components/SceneCore/types/base'
import type { IBaseProps } from '@/components/SceneCore/types/props'
export function hasSelectedComponent(props: IBaseProps, item: TComponent) {
  return props.selectedComponent.some((componentItem) => componentItem.id === item.id)
}

export function useSelectedComponent() {
  const selectedComponentMap: Map<TComponent['id'], TComponent> = new Map()
  return {
    selectedComponentMap,
    add: (item: TComponent, replace = false) => {
      if (selectedComponentMap.has(item.id)) {
        if (!replace) return
        selectedComponentMap.set(item.id, item)
      }
      selectedComponentMap.set(item.id, item)
    },
    remove: (item: TComponent) => {
      selectedComponentMap.delete(item.id)
    },
    clear: () => {
      selectedComponentMap.clear()
    },
    getValues: () => {
      return Array.from(selectedComponentMap.values())
    },
  }
}

export function addSelectedComponent(
  props: IBaseProps,
  item: TComponent,
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

export function addSelectedComponentList(
  props: IBaseProps,
  itemList: TComponent[],
  needClear: boolean = false,
) {
  if (needClear) {
    props.selectedComponent.length = 0
  }
  props.selectedComponent.push(...itemList)
}
export function replaceSelectedComponentList(props: IBaseProps, itemList: TComponent[]) {
  props.selectedComponent = itemList
}
