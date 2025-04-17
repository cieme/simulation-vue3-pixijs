<!-- eslint-disable vue/valid-template-root -->
<template></template>
<script setup lang="ts">
import { onMounted, onUnmounted } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateNode } from '@/components/SceneCore/hooks/createNode'
import { Application } from 'pixi.js'
import type { ISourceComponent } from '@/components/SceneCore/types/base'
import type { ISourceProps } from '@/components/SceneCore/types/props'

const props = withDefaults(defineProps<ISourceProps>(), {
  config: () => ({}) as ISourceComponent,
  selectedComponent: () => [],
})

const { userData } = useApp()
let disposeNode: () => void
function init(app: Application) {
  const { dispose } = useCreateNode({
    props,
    config: props.config,
    userData,
  })
  disposeNode = dispose
}
onMounted(() => {
  init(userData.app as Application)
})
onUnmounted(() => {
  if (disposeNode) {
    disposeNode()
  }
})
</script>
<style lang="scss" scoped></style>
