<template>
  <div></div>
</template>
<script setup lang="ts">
import * as PIXI from 'pixi.js'
import { Viewport } from 'pixi-viewport'
import { Simple, SpatialHash, type DisplayObjectWithCulling } from 'pixi-cull'

init()
async function init() {
  const app = new PIXI.Application()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).__PIXI_APP__ = app
  await app.init()
  document.body.appendChild(app.canvas)

  // create viewport
  const viewport = new Viewport({
    screenWidth: app.canvas.offsetWidth,
    screenHeight: app.canvas.offsetHeight,
    worldWidth: 10000,
    worldHeight: 10000,
    events: app.renderer.events,
    allowPreserveDragOutside: false,
  })
  viewport.label = 'xxxx'
  app.stage.addChild(viewport)
  viewport.drag().pinch().wheel().decelerate().moveCenter(5000, 5000)
  const container = new PIXI.Container()
  viewport.addChild(container)
  // add red boxes
  for (let i = 0; i < 1000; i++) {
    const sprite = container.addChild(new PIXI.Sprite(PIXI.Texture.WHITE))
    sprite.tint = 0xff0000
    sprite.width = sprite.height = 100
    sprite.position.set(Math.random() * 10000, Math.random() * 10000)
  }

  const cull = new Simple() // new SpatialHash()
  if (viewport.children) {
    cull.addList(container.children as DisplayObjectWithCulling[])
  }

  cull.cull(viewport.getVisibleBounds())

  // cull whenever the viewport moves
  PIXI.Ticker.shared.add(() => {
    if (viewport.dirty) {
      cull.cull(viewport.getVisibleBounds())
      viewport.dirty = false
    }
  })
}
</script>
