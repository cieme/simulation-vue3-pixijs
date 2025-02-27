<template>
  <main class="flex flex-col h-screen">
    <Header class="flex-shrink-0" />
    <section class="flex box-container w-screen">
      <div class="left h-full"></div>
      <div class="content h-full flex-1 overflow-hidden">
        <SceneCore>
          <Source v-for="item in list" :key="item.id" :config="item" />
        </SceneCore>
      </div>
      <div class="right h-full"></div>
    </section>
  </main>
</template>
<script setup lang="ts">
import { ref } from 'vue'
import Header from '@/components/Header/index.vue'
import SceneCore from '@/components/SceneCore/SceneCore.vue'
import Source from '@/components/SceneCore/components/Source.vue'
const list = ref([{ label: '源', id: 1 }])
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
