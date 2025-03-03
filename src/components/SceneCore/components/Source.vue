<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateNode } from '@/components/SceneCore/hooks/createNode'

import { Application, Container } from 'pixi.js'

interface IBaseComponent {
  config: object
  selectedComponent: { id: string; label: string }[]
}
const props = withDefaults(defineProps<IBaseComponent>(), {
  config: () => ({}),
  selectedComponent: () => [],
})

const { app, assets, root } = useApp()

function init(app: Application, assets: any) {
  const { addToScene } = useCreateNode({
    props,
    config: props.config,
    assets,
    root,
    app,
  })
  addToScene(app)
}
onMounted(() => {
  init(app as Application, assets)
})
</script>
<style lang="scss" scoped></style>
