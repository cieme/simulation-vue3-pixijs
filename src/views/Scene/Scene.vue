<template>
  <main class="flex flex-col h-screen">
    <Header class="flex-shrink-0" />
    <section class="flex box-container w-screen relative">
      <div class="left h-full">
        <div class="flex w-full h-full justify-center items-center p-4">
          <router-link to="/login">
            <a-button type="primary">login</a-button>
          </router-link>
        </div>
      </div>
      <div class="content h-full flex-1 overflow-hidden relative">
        <Tool
          v-if="isSceneLoaded"
          class="tool-bar absolute top-2 left-2 z-10"
          :userData="userData"
          :Ref_scale="userData.Ref_scale.value"
        ></Tool>
        <Core
          :Ref_selectedComponent="Ref_selectedComponent"
          :isSceneLoaded="isSceneLoaded"
          :componentList="Ref_configList"
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
import { ref, onMounted, onBeforeUnmount, type Ref, watch } from 'vue'

import Header from '@/components/Header/index.vue'
import Core from '@/components/SceneCore/components/Core.vue'

import Tool from '@/components/SceneCore/tools/Tool.vue'
import { useScene } from '@/components/SceneCore/hooks/scene'

import type { TComponent } from '@/components/SceneCore/types/base'
import { Link } from '@/components/SceneCore/link/Link'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'

const refTarget = ref<HTMLDivElement>()

const { Ref_selectedComponent, userData, Ins_linkManager, isSceneLoaded } = useScene(refTarget)
const Ref_configList = userData.Ref_configList
let timer: number | null = null

function genData() {
  const length = 6
  const maxX = 500
  const maxY = 500
  return Array.from({ length }, (_, index) => {
    const data: TComponent = {
      label: `剪${index + 1}`,
      type: E_COMPONENT_TYPE.SOURCE,
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
watch(isSceneLoaded, (value) => {
  if (value) {
    initTest()
  }
})
function initTest() {
  timer = setTimeout(() => {
    const link = new Link({
      uniqueId: '1',
      start: '素材sadadada1',
      end: '2',
      point: [
        { x: 100, y: 100 },
        { x: 200, y: 200 },
      ],
    })
    const link2 = new Link({
      uniqueId: '2',
      start: '2',
      end: '素材sadadada1',
      point: [
        { x: 30, y: 30 },
        { x: 80, y: 90 },
      ],
    })
    // link.end = '2'
    userData.linkModule.LinkData.push(link)
    userData.linkModule.LinkData.push(link2)
    Ins_linkManager.render()
    Ins_linkManager.genAllLabelNodes()
  }, 1e3)
  setTimeout(() => {
    const xx: TComponent = {
      label: `素材sadadada${1}`,
      type: E_COMPONENT_TYPE.TRACK,
      id: `素材sadadada${1}`,
      position: { x: 100, y: 100 },
      points: [
        { x: 200, y: 100 },
        { x: 200, y: 200 },
        { x: -400, y: 400 },
      ],
    }
    const yy: TComponent = {
      label: `素材sadadada${2}`,
      type: E_COMPONENT_TYPE.TRACK,
      id: `素材sadadada${2}`,
      position: { x: 100, y: 180 },
      points: [
        { x: 300, y: 200 },
        { x: 12, y: 66 },
        { x: -88, y: 250 },
      ],
    }
    Ref_configList.value = [xx, ...genData(), yy]
  }, 0)
}
onMounted(() => {
  document.addEventListener('contextmenu', documentRightClick)
})
onBeforeUnmount(() => {
  if (timer) {
    clearTimeout(timer)
  }
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
