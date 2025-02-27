<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateNode } from '@/components/SceneCore/hooks/createNode'

import { Application, Container } from 'pixi.js'

const props = defineProps({
  config: {
    type: Object,
    required: true,
    default: () => ({}),
  },
  selectedComponent: {
    type: Array,
    default: () => [],
  },
})

const { app, assets, root } = useApp()

function init(app: Application, assets: any) {
  const { addToScene } = useCreateNode({
    props,
    config: props.config,
    assets,
    root,
  })
  addToScene(app)
}
onMounted(() => {
  init(app as Application, assets)
})
</script>
<style lang="scss" scoped></style>
