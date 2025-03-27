<template>
  <div class="pixi-wrapper w-full h-full relative">
    <slot name="default"></slot>
    <template v-if="props.assets && props.hasApp">
      <component
        :is="componentMap[item.type]"
        :selectedComponent="props.selectedComponent"
        v-for="item in props.componentList"
        :key="item.id"
        :config="item as Tets<TComponentType>"
      ></component>
    </template>
  </div>
</template>
<script setup lang="ts">
import { type Reactive } from 'vue'
import Source from '@/components/SceneCore/components/Source.vue'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
} from '@/components/SceneCore/types/base'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import type { IAssets } from '@/components/SceneCore/types/hooks'
import type { TComponentType } from '@/components/SceneCore/types/components'

interface ICoreProps {
  selectedComponent: IBaseProps['selectedComponent']
  componentList: TComponent[]
  assets: Reactive<IAssets>
  hasApp: boolean
}
const props = withDefaults(defineProps<ICoreProps>(), {
  selectedComponent: () => [],
  componentList: () => [],
  assets: () => ({}) as Reactive<IAssets>,
  hasApp: () => false,
})

const componentMap = {
  Source: Source,
}
const getComponents = (item: TComponent) => {
  if (item.type === 'Source') {
    return item as ISourceComponent
  }
  return {} as ISourceComponent
}
type Tets<T> = T extends 'Source' ? ISourceComponent : IBaseComponent
</script>
<style lang="scss" scoped></style>
