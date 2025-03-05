<template>
  <div ref="refDown" class="w-screen h-screen"></div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import { Application, Sprite, Texture } from 'pixi.js'
import { Viewport } from 'pixi-viewport'

const refDown = ref<HTMLDivElement>()

let viewport: Viewport
onMounted(async () => {
  if (refDown.value) {
    const app = new Application()
    ;(globalThis as any).__PIXI_APP__ = app
    await app.init({
      width: refDown.value.clientWidth,
      height: refDown.value.clientHeight,
      resizeTo: window,
    })
    refDown.value.appendChild(app.canvas)

    viewport = new Viewport({
      screenWidth: window.innerWidth,
      screenHeight: window.innerHeight,
      worldWidth: 1000,
      worldHeight: 1000,
      events: app.renderer.events,
    })
    viewport.label = 'Viewport'
    app.stage.addChild(viewport)

    // activate plugins
    viewport
      .drag({
        mouseButtons: 'left',
      })
      .pinch()
      .wheel({})
      .decelerate()

    // add a red box
    const sprite = viewport.addChild(new Sprite(Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    sprite.position.set(100, 100)
  }
})
</script>
<style lang="scss" scoped></style>
