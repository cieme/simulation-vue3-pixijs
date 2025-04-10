<template>
  <div ref="refDom"></div>
</template>
<script setup lang="ts">
import { ref, onMounted, onUnmounted, nextTick } from 'vue'
import {
  Application,
  Assets,
  Sprite,
  Texture,
  DEPRECATED_WRAP_MODES,
  DisplacementFilter,
  Container,
} from 'pixi.js'
import { BulgePinchFilter } from 'pixi-filters'

const refDom = ref<HTMLDivElement>()
const app = ref<Application | null>(null)
const sprite = ref<Sprite | null>()
const texture = ref<Texture | null>()
const overlaySprite = ref<Sprite | null>()
const overlayTexture = ref<Texture | null>()
const assets = {
  images: {
    LOGINBG: '/login/technology-8576321_1920.jpg',
    overlay: '/login/displacement_map.png',
  },
}
const filter = new BulgePinchFilter()

onMounted(() => {
  initApplication()
  window.addEventListener('mousemove', onMouseMove)
})
onUnmounted(() => {
  window.removeEventListener('resize', resize)
  window.removeEventListener('mousemove', onMouseMove)
  destroyAll()
})

function destroyAll() {
  Assets.unload(assets.images.LOGINBG)
  if (app.value) {
    app.value.ticker.remove(onTicker)
    // 销毁 Application
    app.value.destroy(true, {
      children: true,
      texture: true,
      // textureSource: true,
      context: true,
      style: true,
    })
    app.value = null
    sprite.value = null
    texture.value = null
    overlaySprite.value = null
    overlayTexture.value = null
  }
}
const onMouseMove = (e: MouseEvent) => {
  filter.center.x = e.clientX / window.innerWidth
  filter.center.y = e.clientY / window.innerHeight
}
const resize = () => {
  app.value?.renderer.resize(window.innerWidth, window.innerHeight)
  if (app.value) {
    app.value.stage.position.x = app.value.screen.width / 2
    app.value.stage.position.y = app.value.screen.height / 2
  }

  if (sprite.value) {
    const targetWidth = window.innerWidth
    const targetHeight = window.innerHeight
    /*  */
    sprite.value!.width = targetWidth
    sprite.value!.height = targetHeight
    if (texture.value) {
      const textureWidth = texture.value.width
      const textureHeight = texture.value.height
      /*  */
      const textureRatio = textureWidth / textureHeight
      const targetRatio = targetWidth / targetHeight

      // 计算缩放比例，选择更大的一方
      let scale
      if (textureRatio > targetRatio) {
        scale = targetHeight / textureHeight
      } else {
        scale = targetWidth / textureWidth
      }

      // 设置缩放比例
      sprite.value.scale.set(scale)
    }
  }
}

async function initApplication() {
  app.value = new Application()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  ;(globalThis as any).__PIXI_APP__ = app.value
  await app.value.init({
    antialias: true, // default:false 开启抗锯齿
    backgroundColor: 0x00000,
    preference: 'webgl',
  })
  refDom.value!.appendChild(app.value.canvas)

  window.addEventListener('resize', resize)

  await addBgTexture()
  resize()
}
function onTicker() {
  overlaySprite.value!.x += 1
  overlaySprite.value!.y += 1
}
async function addBgTexture() {
  const container = new Container()
  app.value!.stage.addChild(container)
  texture.value = await Assets.load(assets.images.LOGINBG)
  texture.value!.source.addressMode = DEPRECATED_WRAP_MODES.REPEAT

  overlayTexture.value = await Assets.load(assets.images.overlay)
  overlayTexture.value!.source.addressMode = DEPRECATED_WRAP_MODES.REPEAT
  // 图像尺寸
  sprite.value = new Sprite(texture.value!)
  sprite.value.anchor.set(0.5, 0.5)

  sprite.value.width = window.innerWidth
  sprite.value.height = window.innerHeight

  overlaySprite.value = new Sprite(overlayTexture.value!)
  overlaySprite.value.anchor.set(0.5, 0.5)
  overlaySprite.value.width = window.innerWidth
  overlaySprite.value.height = window.innerHeight
  /*  */
  const filter = new BulgePinchFilter({
    strength: 1,
    radius: 80,
  })
  const displacementFilter = new DisplacementFilter({
    scale: 40,
    sprite: overlaySprite.value,
  })
  /*  */
  container.addChild(overlaySprite.value)

  container.filters = [filter, displacementFilter]
  container.addChild(sprite.value)
  app.value!.ticker.add(onTicker)
}
</script>
<style lang="scss" scoped></style>
