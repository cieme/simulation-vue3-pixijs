<template>
  <div class="pixi-wrapper w-full h-full relative" ref="refTarget">
    <Tool class="absolute top-2 left-2 z-10" :userData="userData" :app="app" :root="root"></Tool>
    <slot v-if="assets.sheet && hasApp" :selectedComponent="selectedComponent"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Tool from '../tools/Tool.vue'
import { useScene } from '@/components/SceneCore/hooks/scene'
const refTarget = ref<HTMLDivElement>()
const { selectedComponent, assets, hasApp, userData, root, app } = useScene(refTarget)
</script>
<style lang="scss" scoped></style>
