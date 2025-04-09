import {
  type Ref,
  type ComputedRef,
  ref,
  computed,
  watch,
  provide,
  onMounted,
  onBeforeUnmount,
  shallowReactive,
  nextTick,
} from 'vue'
import { Application } from 'pixi.js'
import Grid from '@/components/SceneCore/core/Grid'
import SelectArea from '@/components/SceneCore/core/SelectArea'
import LinkManager from '@/components/SceneCore/core/Link'

import { useAssets } from '@/components/SceneCore/hooks/assets'
import { useRootContainer } from '@/components/SceneCore/hooks/createNode'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import emitter, { E_EVENT_SCENE, ENUM_TOOL } from '@/components/SceneCore/mitt/mitt'
import { type TComponent } from '@/components/SceneCore/types/base'
import { type IBaseProps } from '@/components/SceneCore/types/props'
/**
 * 使用场景
 *
 * @export
 * @param {Ref<HTMLDivElement | undefined>} refTarget
 * @returns {{ app: any; assets: any; root: any; showComponent: any; initStage: () => any; selectedComponent: any; selectedNodes: any; }}
 */
export function useScene(refTarget: Ref<HTMLDivElement | undefined>) {
  /* 1 */

  const app = new Application()
  ;(globalThis as unknown as { __PIXI_APP__: Application }).__PIXI_APP__ = app

  provide('app', app)

  const { assets } = useAssets()
  provide('assets', assets)

  const { root } = useRootContainer()
  provide('root', root)
  /* 2 */
  const grid = new Grid()

  const nodeList: ICreateNodeParams['userData']['nodeList'] = new Map()
  const selectedComponent = ref<IBaseProps['selectedComponent']>([])
  const selectedNodes = computed(() => {
    const list = selectedComponent.value
      .map((node) => {
        return nodeList.get(node.id)
      })
      .filter((item) => !!item)

    return list
  })
  const configList = ref<TComponent[]>([])
  const userData = shallowReactive<ICreateNodeParams['userData']>({
    configList,
    nodeList,
    selectedNodes,
    operationStatus: ref(ENUM_TOOL.SELECT),
    linkReactive: {
      status: null,
      startComponentConfig: null,
      linking: null,
      LinkData: [],
      reset: () => {
        userData.linkReactive.status = null
        userData.linkReactive.startComponentConfig = null
        userData.linkReactive.linking = null
      },
    },
  })

  provide('userData', userData)

  const hasApp = ref(false)
  /*  */
  const shallowParams = {
    app,
    root,
    assets,
    userData,
    props: {
      selectedComponent: selectedComponent.value,
    },
  }
  /* 4 */
  const selectArea = new SelectArea(shallowParams)
  const LinkInstance = new LinkManager(shallowParams)

  /* 5 */
  async function initStage() {
    await app.init({
      preference: 'webgpu',
      autoStart: false,
      sharedTicker: true,
      antialias: true,
      // resolution: window.devicePixelRatio, // 不要给这个字段，放大和缩小，会导致 尺寸不正确的问题
    })
    app.stage.label = 'stage'
    root.addChild(grid.node)
    root.addChild(selectArea.node)
    root.addChild(LinkInstance.node)
    app.stage.addChild(root)
    selectArea.init()
    LinkInstance.init()
    refTarget.value!.appendChild(app.canvas)
    appClick()
    hasApp.value = true
    resize()
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
        // texture: true,
        // textureSource: true,
        context: true,
        style: true,
      },
    )
    app.stage?.removeChildren()
    app.stage?.removeListener('mousedown', appMouseDownHandler)
    app.stage?.destroy()
    emitter.all.clear() // 清除所有监听
  }
  /* 6 */
  onMounted(async () => {
    initStage()
    window.addEventListener('resize', resize)
  })
  onBeforeUnmount(() => {
    dispose()
    window.removeEventListener('resize', resize)
  })
  const appMouseDownHandler = () => {
    console.log('画布清除选中组件')
    selectedComponent.value.length = 0
  }
  function appClick() {
    app.stage.interactive = true
    app.stage.on('mousedown', appMouseDownHandler)
  }

  userData.selectedNodes = selectedNodes

  return {
    app,
    assets,
    root,
    hasApp,
    initStage,
    selectedNodes,
    userData,
    selectedComponent,
  }
}
