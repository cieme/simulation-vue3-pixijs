import type { TComponent } from '@/components/SceneCore/types/base'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import { nextTick } from 'vue'
export function hasSelectedComponent(props: IBaseProps, item: TComponent) {
  return props.Ref_selectedComponent.get(item.id)
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
    props.Ref_selectedComponent.clear()
  }
  nextTick(() => {
    props.Ref_selectedComponent.set(item.id, item)
  })
}

export function addSelectedComponentList(
  props: IBaseProps,
  itemList: TComponent[],
  needClear: boolean = false,
) {
  if (needClear) {
    props.Ref_selectedComponent.clear()
  }
  for (const item of itemList) {
    props.Ref_selectedComponent.set(item.id, item)
  }
}
export function replaceSelectedComponentList(
  Ref_selectedComponent: IBaseSceneParams['userData']['Ref_selectedComponent'],
  itemList: TComponent[],
) {
  Ref_selectedComponent.value.clear()
  for (const item of itemList) {
    Ref_selectedComponent.value.set(item.id, item)
  }
}
