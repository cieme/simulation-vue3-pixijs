<template>
  <div class="pixi-wrapper w-full h-full relative">
    <slot name="default"></slot>
    <template v-if="props.isSceneLoaded">
      <Distribute
        :selectedComponent="props.selectedComponent"
        v-for="item in props.componentList"
        :key="item.id"
        :config="item"
      ></Distribute>
    </template>
  </div>
</template>
<script setup lang="ts">
import { type Reactive } from 'vue'

import Distribute from '@/components/SceneCore/components/Distribute.vue'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
  ITrackComponent,
} from '@/components/SceneCore/types/base'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'

interface ICoreProps {
  selectedComponent: IBaseProps['selectedComponent']
  componentList: TComponent[]
  isSceneLoaded: boolean
}
const props = withDefaults(defineProps<ICoreProps>(), {
  selectedComponent: () => [],
  componentList: () => [],
  isSceneLoaded: () => false,
})

type Tets<T> = T extends E_COMPONENT_TYPE.SOURCE
  ? ISourceComponent
  : T extends E_COMPONENT_TYPE.TRACK
    ? ITrackComponent
    : IBaseComponent
</script>
<style lang="scss" scoped></style>
