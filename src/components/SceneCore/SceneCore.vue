<template>
  <div class="pixi-wrapper w-full h-full" ref="refTarget">
    <slot v-if="hasAssets"></slot>
  </div>
</template>
<script setup lang="ts">
import { ref, watch, provide, onMounted, onUnmounted } from 'vue'
import { Application, Container } from 'pixi.js'
import { useAssets } from '@/components/SceneCore/hooks/assets'

const refTarget = ref<HTMLDivElement>()
const app = new Application()

;(globalThis as any).__PIXI_APP__ = app
provide('app', app)

const { assets } = useAssets()
provide('assets', assets)

const root = new Container()
root.label = 'root'
provide('root', root)

const hasAssets = ref(false)

watch(
  () => assets?.sheet,
  () => {
    hasAssets.value = true
  },
)
async function initStage() {
  await app.init({
    preference: 'webgpu',
    autoStart: false,
    resizeTo: refTarget.value,
    sharedTicker: true,
    antialias: true,
    resolution: window.devicePixelRatio,
  })
  app.stage.label = 'stage'
  app.stage.addChild(root)
  resize()
  refTarget.value!.appendChild(app.canvas)
}

const resize = () => {
  app.stage.position.x = app.renderer.screen.width / 2
  app.stage.position.y = app.renderer.screen.height / 2
}
/*  */
function dispose() {
  app?.destroy?.(
    {
      removeView: true,
    },
    {
      children: true,
      texture: true,
      textureSource: true,
      context: true,
      style: true,
    },
  )
}
onMounted(async () => {
  initStage()

  window.addEventListener('resize', resize)
})
onUnmounted(() => {
  dispose()
  window.removeEventListener('resize', resize)
})
</script>
<style lang="scss" scoped></style>
