<template>
  <main class="flex flex-col h-screen">
    <Header class="flex-shrink-0" />
    <section class="flex box-container w-screen relative">
      <div class="left h-full"></div>
      <div class="content h-full flex-1 overflow-hidden relative">
        <Tool
          v-if="hasApp"
          class="tool-bar absolute top-2 left-2 z-10"
          :userData="userData"
          :app="app"
          :root="root"
          :ref-scale="userData.refScale.value"
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
import { ref, onMounted, onBeforeUnmount, type Ref } from 'vue'

import Header from '@/components/Header/index.vue'
import Core from '@/components/SceneCore/components/Core.vue'

import Tool from '@/components/SceneCore/tools/Tool.vue'
import { useScene } from '@/components/SceneCore/hooks/scene'

import type { TComponent } from '@/components/SceneCore/types/base'
import { Link } from '@/components/SceneCore/link/Link'

const refTarget = ref<HTMLDivElement>()

const { selectedComponent, hasApp, userData, app, root, assets, linkInstance } = useScene(refTarget)
const configList = userData.configList
setTimeout(() => {
  const link = new Link({
    uniqueId: '1',
    start: '1',
    end: '2',
    point: [
      { x: 100, y: 100 },
      { x: 200, y: 200 },
    ],
  })
  // link.end = '2'
  userData.linkReactive.LinkData.push(link)
  linkInstance.render()
}, 1e3)
function genData() {
  const length = 6
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

function documentRightClick(e: MouseEvent) {
  e.preventDefault()
  e.stopPropagation()
}

onMounted(() => {
  setTimeout(() => {
    configList.value = genData()
  }, 0)
  document.addEventListener('contextmenu', documentRightClick)
})
onBeforeUnmount(() => {
  document.removeEventListener('contextmenu', documentRightClick)
})
</script>
<style lang="scss" scoped>
.left {
  width: var(--slide-width);
  @apply left-0;
}
.right {
  width: var(--panel-width);
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
.tool-bar {
  margin-left: var(--slide-width);
}
</style>
