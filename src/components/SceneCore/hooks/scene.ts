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
import { Application, Assets, FederatedPointerEvent, type PointData } from 'pixi.js'
import Grid from '@/components/SceneCore/core/Grid'
import SelectArea from '@/components/SceneCore/core/SelectArea'
import LinkManager from '@/components/SceneCore/core/Link'

import { useAssets } from '@/components/SceneCore/hooks/assets'
import { useRootContainer } from '@/components/SceneCore/hooks/createNode'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import emitter, { E_EVENT_SCENE, ENUM_TOOL } from '@/components/SceneCore/mitt/mitt'
import { ENUM_BOARD_CODE } from '@/components/SceneCore/enum'
import { type TComponent } from '@/components/SceneCore/types/base'
import { type IBaseProps } from '@/components/SceneCore/types/props'
import Stats from 'stats.js'
import { initDevtools } from '@pixi/devtools';
import '@/components/SceneCore/core/MU/MU'
/**
 * 使用场景
 *
 * @export
 * @param {Ref<HTMLDivElement | undefined>} refTarget
 * @returns {{ app: any; assets: any; root: any; showComponent: any; initStage: () => any; selectedComponent: any; selectedNodes: any; }}
 */
export function useScene(refTarget: Ref<HTMLDivElement | undefined>) {
  // useStats()
  /* 1 */

  const app = new Application()
  initDevtools({ app });

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
  const selectComponentLength = computed(() => {
    return selectedComponent.value.length
  })
  const userData = shallowReactive<ICreateNodeParams['userData']>({
    configList,
    nodeList,
    selectedNodes,
    selectedComponent,
    selectComponentLength,
    operationStatus: ref(ENUM_TOOL.SELECT),
    refScale: ref<PointData>(root.scale),
    currentLink: null,
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
      selectedComponent,
    },
  }
  /* 4 */
  const selectArea = new SelectArea(shallowParams)
  const linkInstance = new LinkManager(shallowParams)

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
    root.addChild(linkInstance.node)
    app.stage.addChild(root)
    selectArea.init()
    linkInstance.init()
    refTarget.value!.appendChild(app.canvas)
    addAppEvent()
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
    removeAppEvent()
    app?.destroy?.(
      {
        removeView: true,
      },
      {
        children: true,
        texture: true,
        // textureSource: true,
        context: true,
        style: true,
      },
    )
    app.stage?.removeChildren()
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

  function addAppEvent() {
    app.stage.interactive = true
    app.stage.on('mousedown', appMouseDownHandler)
    /* 添加键盘事件 */
    app.canvas.setAttribute('tabindex', '0')
    app.canvas.addEventListener('keydown', onkeyDown)
    app.canvas.addEventListener('keyup', onkeyUp)
  }

  function removeAppEvent() {
    app.stage?.removeListener('mousedown', appMouseDownHandler)
    app.canvas.removeEventListener('keydown', onkeyDown)
    app.canvas.removeEventListener('keyup', onkeyUp)
  }
  const appMouseDownHandler = (e: FederatedPointerEvent) => {
    console.log('scene mousedown')
    selectedComponent.value.length = 0
    linkInstance.clearPointAndClearCurrentLink()
    emitter.emit(E_EVENT_SCENE.MOUSE_DOWN_SCENE, e)
  }

  const keyDownMap = new Map()
  const onkeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return // 如果事件已经在进行中，则不做任何事。
    }
    if (keyDownMap.has(e.code)) {
      return
    }
    console.log(e)
    keyDownMap.set(e.code, true)
    switch (e.code) {
      case ENUM_BOARD_CODE.Delete:
      case ENUM_BOARD_CODE.Backspace:
        boardDelete(e)
        break

      default:
        break
    }
    // 取消默认动作，从而避免处理两次。
    // e.preventDefault()
  }
  const onkeyUp = (e: KeyboardEvent) => {
    keyDownMap.delete(e.code)
  }
  const boardDelete = (e: KeyboardEvent) => {
    /* 如果有组件选中，删除组件，如果有连接线选中，删除连接线 */
    if (selectedComponent.value.length > 0) {
      selectedComponent.value.forEach((item) => {
        /* 删除节点缓存 */
        nodeList.delete(item.id)
        /* 删除组件 */
        const index = userData.configList.value.findIndex((component) => component.id === item.id)
        userData.configList.value.splice(index, 1)
        /* 删除连接线 */
      })
      /* 清掉选中的 */
      selectedComponent.value.length = 0
    }
    /* 删除连接线 */
    if (userData.currentLink) {
      const id = userData.currentLink.uniqueId
      userData.linkReactive.LinkData.find((item) => {
        if (item.uniqueId === id) {
          userData.linkReactive.LinkData.splice(userData.linkReactive.LinkData.indexOf(item), 1)
          return true
        }
        return false
      })
      linkInstance.clearPointAndClearCurrentLink()
      linkInstance.render()
    }
  }
  watch(userData.selectComponentLength, (val) => {
    userData.currentLink = null
    linkInstance.clearPointAndClearCurrentLink()
  })
  return {
    app,
    assets,
    root,
    hasApp,
    initStage,
    selectedNodes,
    userData,
    selectedComponent,
    linkInstance,
  }
}
export function useStats() {
  const stats = new Stats()
  stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(stats.dom)
  const update = () => {
    stats.update()
    requestAnimationFrame(update)
  }
  update()
  return stats
}
