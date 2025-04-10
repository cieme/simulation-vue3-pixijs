<!-- eslint-disable vue/valid-template-root -->
<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch, render, onUnmounted } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateNode } from '@/components/SceneCore/hooks/createNode'
import { Application, Container } from 'pixi.js'
import type { ISourceComponent } from '@/components/SceneCore/types/base'
import type { ISourceProps } from '@/components/SceneCore/types/props'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks.ts'

const props = withDefaults(defineProps<ISourceProps>(), {
  config: () => ({}) as ISourceComponent,
  selectedComponent: () => [],
})

const { app, assets, root, userData } = useApp()
let disposeNode: () => void
function init(app: Application, assets: IBaseSceneParams['assets']) {
  const { addToScene, dispose } = useCreateNode({
    props,
    config: props.config,
    app,
    assets,
    root,
    userData,
  })
  addToScene(app)
  disposeNode = dispose
}
onMounted(() => {
  init(app as Application, assets as IBaseSceneParams['assets'])
})
onUnmounted(() => {
  if (disposeNode) {
    disposeNode()
  }
})
</script>
<style lang="scss" scoped></style>
