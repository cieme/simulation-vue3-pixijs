<!-- eslint-disable vue/valid-template-root -->
<template></template>
<script setup lang="ts">
import { ref, reactive, computed, onMounted, useAttrs, watch, render, onUnmounted } from 'vue'
import { useApp } from '@/components/SceneCore/hooks/index'
import { useCreateTrack } from '@/components/SceneCore/hooks/createTrack'
import { Application, Container } from 'pixi.js'
import type { ITrackComponent } from '@/components/SceneCore/types/base'
import type { ITrackProps } from '@/components/SceneCore/types/props'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'

const props = withDefaults(defineProps<ITrackProps>(), {
  config: () => ({}) as ITrackComponent,
  selectedComponent: () => [],
})

const {  userData } = useApp()
let disposeNode: () => void
function init(app: Application) {
  const { addToScene, dispose } = useCreateTrack({
    props,
    config: props.config,

    userData,
  })
  addToScene(app)
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
