<template>
  <main class="flex flex-col h-screen">
    <Header class="flex-shrink-0" />
    <section class="flex box-container w-screen relative">
      <div class="left h-full"></div>
      <div class="content h-full flex-1 overflow-hidden relative">
        <Tool
          v-if="hasApp"
          class="absolute top-2 left-2 z-10"
          :userData="userData"
          :app="app"
          :root="root"
        ></Tool>
        <Core
          :selectedComponent="selectedComponent"
          :assets="assets"
          :has-app="hasApp"
          :componentList="configList"
        >
          <template #default>
            <div class="w-full h-full" ref="refTarget"></div>
          </template>
        </Core>
      </div>
      <div class="right h-full"></div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ref, onMounted } from 'vue'

import Header from '@/components/Header/index.vue'
import Core from '@/components/SceneCore/components/Core.vue'

import Tool from '@/components/SceneCore/tools/Tool.vue'
import { useScene } from '@/components/SceneCore/hooks/scene'

import type { TComponent } from '@/components/SceneCore/types/base'

const refTarget = ref<HTMLDivElement>()
const { selectedComponent, hasApp, userData, app, root, assets } = useScene(refTarget)
const configList = userData.configList
function genData() {
  const length = 20
  const maxX = 500
  const maxY = 500
  return Array.from({ length }, (_, index) => {
    const data: TComponent = {
      label: `素材${index + 1}`,
      type: 'Source',
      id: `${index + 1}`,
      position: { x: Math.random() * maxX - maxX / 2, y: Math.random() * maxY - maxY / 2 },
    }
    return data
  })
}
onMounted(() => {
  setTimeout(() => {
    configList.value = genData()
  }, 0)
})
</script>
<style lang="scss" scoped>
.left {
  width: 342px;
  @apply left-0;
}
.right {
  width: 312px;
  @apply right-0;
}
.left,
.right {
  @apply absolute h-full bottom-0 z-10;
  background-color: #20252e;
}
.box-container {
  height: calc(100vh - 42px);
}
.content {
  // width: calc(100vw - 342px - 312px);
  @apply w-full;
}
</style>
