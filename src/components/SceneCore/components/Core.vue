<template>
  <div class="pixi-wrapper w-full h-full relative">
    <slot name="default"></slot>
    <template v-if="props.assets && props.hasApp">
      <component
        :is="componentMap[item.type]"
        :selectedComponent="props.selectedComponent"
        v-for="item in props.componentList"
        :key="item.id"
        :config="item"
      ></component>
    </template>
  </div>
</template>
<script setup lang="ts">
import { type Reactive } from 'vue'
import Source from '@/components/SceneCore/components/Source.vue'
import Track from '@/components/SceneCore/components/Track.vue'
import type {
  TComponent,
  IBaseComponent,
  ISourceComponent,
  ITrackComponent,
} from '@/components/SceneCore/types/base'
import type { IBaseProps } from '@/components/SceneCore/types/props'
import type { IAssets } from '@/components/SceneCore/types/hooks/index'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'

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
  [E_COMPONENT_TYPE.SOURCE]: Source,
  [E_COMPONENT_TYPE.TRACK]: Track,
}
type ComponentPropsMap = {
  SOURCE: ISourceComponent;
  TRACK: ITrackComponent;
};
type Tets<T> = T extends E_COMPONENT_TYPE.SOURCE
 ? ISourceComponent
 : T extends E_COMPONENT_TYPE.TRACK
   ? ITrackComponent
   : IBaseComponent

</script>
<style lang="scss" scoped></style>
