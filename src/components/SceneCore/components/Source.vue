<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateNode } from '@/components/SceneCore/hooks/createNode'
import { Application, Container } from 'pixi.js'
import type { ISourceProps } from '@/components/SceneCore/types/props'

const props = withDefaults(defineProps<ISourceProps>(), {
  config: () => ({}),
  selectedComponent: () => [],
})

const { app, assets, root, userData } = useApp()

function init(app: Application, assets: any) {
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
  init(app as Application, assets)
})
</script>
<style lang="scss" scoped></style>
