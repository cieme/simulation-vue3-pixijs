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
import Source from '@SceneCore/components/Source.vue'
import type { IBaseComponent } from '@SceneCore/types/props.ts'
import { type IAssets } from '../types/hooks'

interface ICoreProps {
  selectedComponent: IBaseComponent['selectedComponent']
  componentList: IBaseComponent['selectedComponent']
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
</script>
<style lang="scss" scoped></style>
