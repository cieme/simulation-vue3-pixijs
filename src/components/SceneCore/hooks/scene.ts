import {
  type Ref,
  ref,
  computed,
  watch,
  provide,
  onBeforeMount,
  onMounted,
  onBeforeUnmount,
} from 'vue'
import { Application, Assets, Container } from 'pixi.js'
import Grid from '@/components/SceneCore/core/Grid'

import { useAssets } from '@/components/SceneCore/hooks/assets'
import { useRootContainer } from '@/components/SceneCore/hooks/createNode'

export function useScene(refTarget: Ref<HTMLDivElement | undefined>) {
  /* 1 */
  const grid = new Grid()
  const app = new Application()
  ;(globalThis as any).__PIXI_APP__ = app

  provide('app', app)

  const { assets } = useAssets()
  provide('assets', assets)

  const { root } = useRootContainer()
  provide('root', root)

  const hasAssets = ref(false)
  const hasApp = ref(false)

  watch(
    () => assets?.sheet,
    () => {
      hasAssets.value = true
    },
  )

  const showComponent = computed(() => {
    return hasAssets.value && hasApp.value
  })
  /* 2 */
  async function initStage() {
    await app.init({
      preference: 'webgpu',
      autoStart: false,
      sharedTicker: true,
      antialias: true,
      resolution: window.devicePixelRatio,
    })
    app.stage.label = 'stage'
    root.addChild(grid.node)
    app.stage.addChild(root)
    resize()

    refTarget.value!.appendChild(app.canvas)
    appClick()
    hasApp.value = true
  }

  const resize = () => {
    if (refTarget.value) {
      app.renderer.resize(refTarget.value.clientWidth, refTarget.value.clientHeight)
    }
    app.stage.position.x = app.renderer.screen.width / 2
    app.stage.position.y = app.renderer.screen.height / 2
  }

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
  /* 3 */
  onMounted(async () => {
    initStage()
    window.addEventListener('resize', resize)
  })
  onBeforeUnmount(() => {
    dispose()
    window.removeEventListener('resize', resize)
  })
  /* 4 */
  const selectedComponent = ref<Array<any>>([])
  function appClick() {
    app.stage.interactive = true
    app.stage.on('mousedown', function (event) {
      console.log(app.stage.getChildByLabel(selectedComponent.value[0].id))
      // selectedComponent.value.length = 0
    })
  }

  return {
    app,
    assets,
    root,
    showComponent,
    initStage,
    selectedComponent,
  }
}
