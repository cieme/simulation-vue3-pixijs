import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
export function hasSelectedComponent(
  props: ICreateNodeParams['props'],
  item: ICreateNodeParams['props']['selectedComponent'][0],
) {
  return props.selectedComponent.some((componentItem) => componentItem.id === item.id)
}

export function useSelectedComponent() {
  const selectedComponentMap: Map<
    ICreateNodeParams['props']['selectedComponent'][0]['id'],
    ICreateNodeParams['props']['selectedComponent'][0]
  > = new Map()
  return {
    selectedComponentMap,
    add: (item: ICreateNodeParams['props']['selectedComponent'][0], replace = false) => {
      if (selectedComponentMap.has(item.id)) {
        if (!replace) return
        selectedComponentMap.set(item.id, item)
      }
      selectedComponentMap.set(item.id, item)
    },
    remove: (item: ICreateNodeParams['props']['selectedComponent'][0]) => {
      selectedComponentMap.delete(item.id)
    },
    clear: () => {
      selectedComponentMap.clear()
    },
    get: () => {
      return Array.from(selectedComponentMap.values())
    },
  }
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

export function addSelectedComponentList(
  props: ICreateNodeParams['props'],
  itemList: ICreateNodeParams['props']['selectedComponent'],
  needClear: boolean = false,
) {
  if (needClear) {
    props.selectedComponent.length = 0
  }
  props.selectedComponent.push(...itemList)
}
