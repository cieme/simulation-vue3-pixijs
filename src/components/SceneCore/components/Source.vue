<!-- eslint-disable vue/valid-template-root -->
<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch, render } from 'vue'
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

function init(app: Application, assets: IBaseSceneParams['assets']) {
  const { addToScene } = useCreateNode({
    props,
    config: props.config,
    app,
    assets,
    root,
    userData,
  })
  addToScene(app)
}
onMounted(() => {
  init(app as Application, assets as IBaseSceneParams['assets'])
})
</script>
<style lang="scss" scoped></style>
