<template>
  <div class="pixi-wrapper w-full h-full relative">
    <slot name="default"></slot>
    <template v-if="props.isSceneLoaded">
      <Distribute
        :Ref_selectedComponent="props.Ref_selectedComponent"
        v-for="(item, key) in props.M_componentList"
        :key="key"
        :config="item[1]"
      ></Distribute>
    </template>
  </div>
</template>
<script setup lang="ts">
import { ref, defineProps } from 'vue'
import Distribute from '@/components/SceneCore/components/Distribute.vue'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
  ITrackComponent,
} from '@/components/SceneCore/types/base'
import type { AllComponentProps } from '@/components/SceneCore/types/props'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'

interface ICoreProps {
  Ref_selectedComponent: Map<string, TComponent>
  M_componentList: Map<string, TComponent>
  isSceneLoaded: boolean
}
const props = withDefaults(defineProps<ICoreProps>(), {
  Ref_selectedComponent: () => new Map<string, TComponent>(),
  M_componentList: () => new Map<string, TComponent>(),
  isSceneLoaded: () => false,
})

type Tets<T> = T extends E_COMPONENT_TYPE.SOURCE
  ? ISourceComponent
  : T extends E_COMPONENT_TYPE.TRACK
    ? ITrackComponent
    : IBaseComponent
</script>
<style lang="scss" scoped></style>
