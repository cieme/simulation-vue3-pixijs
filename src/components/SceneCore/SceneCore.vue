<template>
  {{ selectedComponent }}
  <div class="pixi-wrapper w-full h-full" ref="refTarget">
    <slot v-if="showComponent" :selectedComponent="selectedComponent"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, computed, watch, provide, onBeforeMount, onMounted, onBeforeUnmount } from 'vue'
import { useScene } from '@/components/SceneCore/hooks/scene'
const refTarget = ref<HTMLDivElement>()
const { showComponent, selectedComponent, initStage } = useScene(refTarget)
</script>
<style lang="scss" scoped></style>
