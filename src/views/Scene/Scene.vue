<template>
  <main class="flex flex-col h-screen">
    <Header class="flex-shrink-0" />
    <section class="flex box-container w-screen">
      <div class="left h-full"></div>
      <div class="content h-full flex-1 overflow-hidden">
        <Core>
          <template #default="{ selectedComponent }">
            <Source
              :selectedComponent="selectedComponent"
              v-for="item in list"
              :key="item.id"
              :config="item"
            />
          </template>
        </Core>
      </div>
      <div class="right h-full"></div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header/index.vue'
import Core from '@/components/SceneCore/components/Core.vue'
import Source from '@/components/SceneCore/components/Source.vue'
const list = ref([
  { label: '源', id: 1, position: { x: 0, y: 0 } },
  { label: '源2', id: 2, position: { x: 80, y: 80 } },
])

// function genData() {
//   const length = 500
//   return Array.from({ length }, (_, index) => ({
//     label: `素材${index + 1}`,
//     id: index + 1,
//     position: { x: Math.random() * 700, y: Math.random() * 500 },
//   }))
// }
// list.value = genData()
</script>
<style lang="scss" scoped>
.left {
  width: 342px;
}
.right {
  width: 312px;
}
.box-container {
  height: calc(100vh - 42px);
}
.content {
  width: calc(100vw - 342px - 312px);
}
</style>
