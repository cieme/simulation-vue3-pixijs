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
import { initDevtools } from '@pixi/devtools'
import '@/components/SceneCore/core/MU/MU'
/**
 * 使用场景
 *
 * @export
 * @param {Ref<HTMLDivElement | undefined>} refTarget
 * @returns {{ app: any; assets: any; root: any; showComponent: any; initStage: () => any; Ref_selectedComponent: any; Com_selectedNodes: any; }}
 */
export function useScene(refTarget: Ref<HTMLDivElement | undefined>) {
  // useStats()
  /* 1 */

  const app = new Application()

  const { assets } = useAssets()

  const { node: root } = useRootContainer()
  const { node: trackManagerNode } = useRootContainer('trackManager')
  const { node: trackLabelManagerNode } = useRootContainer('trackLabelManager')

  /* 2 */
  const Ins_Grid = new Grid()

  const M_nodeList: ICreateNodeParams['userData']['M_nodeList'] = new Map()
  const Ref_selectedComponent = ref<IBaseProps['Ref_selectedComponent']>([])
  const Com_selectedNodes = computed(() => {
    const list = Ref_selectedComponent.value
      .map((node) => {
        return M_nodeList.get(node.id)
      })
      .filter((item) => !!item)

    return list
  })
  const Ref_M_configList = ref<Map<string,TComponent>>(new Map())
  const Com_selectComponentLength = computed(() => {
    return Ref_selectedComponent.value.length
  })
  const userData = shallowReactive<ICreateNodeParams['userData']>({
    app,
    assets,
    root,
    trackManagerNode,
    trackLabelManagerNode,
    /*  */
    Ref_M_configList,
    M_nodeList,
    Com_selectedNodes,
    Ref_selectedComponent,
    Com_selectComponentLength,
    Ref_operationStatus: ref(ENUM_TOOL.SELECT),
    Ref_scale: ref<PointData>(root.scale),
    Ins_currentLink: null,
    linkModule: {
      status: null,
      startComponentConfig: null,
      linking: null,
      LinkData: [],
      reset: () => {
        userData.linkModule.status = null
        userData.linkModule.startComponentConfig = null
        userData.linkModule.linking = null
      },
    },
  })

  provide('userData', userData)

  const hasApp = ref(false)
  const isSceneLoaded = computed(() => {
    return hasApp.value && assets.isLoaded
  })
  /*  */
  const shallowParams = {
    app,
    root,
    assets,
    userData,
    props: {
      Ref_selectedComponent,
    },
  }
  /* 4 */
  const Ins_selectArea = new SelectArea(shallowParams)
  const Ins_linkManager = new LinkManager(shallowParams)

  /* 5 */
  async function initStage() {
    await app.init({
      preference: 'webgpu',
      autoStart: false,
      sharedTicker: true,
      antialias: true,
      // resolution: window.devicePixelRatio, // 不要给这个字段，放大和缩小，会导致 尺寸不正确的问题
    })
    initDevtools({ app })
    app.stage.label = 'stage'
    root.addChild(Ins_Grid.node)
    root.addChild(Ins_selectArea.node)
    /* 这个顺序很重要，顺序错了会多一次重绘 */
    root.addChild(trackManagerNode)
    root.addChild(trackLabelManagerNode)
    root.addChild(Ins_linkManager.node)
    /*  */
    app.stage.addChild(root)
    Ins_selectArea.init()
    Ins_linkManager.init()
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
        context: true,
        texture: false,
        textureSource: true,
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
    // clearAssets()
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
    Ref_selectedComponent.value.length = 0
    Ins_linkManager.clearPointAndClearCurrentLink()
    emitter.emit(E_EVENT_SCENE.MOUSE_DOWN_SCENE, e)
  }

  const M_keyDown = new Map()
  const onkeyDown = (e: KeyboardEvent) => {
    if (e.defaultPrevented) {
      return // 如果事件已经在进行中，则不做任何事。
    }
    if (M_keyDown.has(e.code)) {
      return
    }
    console.log(e)
    M_keyDown.set(e.code, true)
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
    M_keyDown.delete(e.code)
  }
  const boardDelete = (e: KeyboardEvent) => {
    /* 如果有组件选中，删除组件，如果有连接线选中，删除连接线 */
    if (Ref_selectedComponent.value.length > 0) {
      const linkArray: string[] = ([] = [])
      Ref_selectedComponent.value.forEach((item) => {
        /* 删除节点缓存 */
        M_nodeList.delete(item.id)
        /* 删除组件 */
        userData.Ref_M_configList.value.delete(item.id)

        /* 删除连接线 */
        for (let index = 0; index < userData.linkModule.LinkData.length; index++) {
          const linkItem = userData.linkModule.LinkData[index]
          if (linkItem.start === item.id || linkItem.end === item.id) {
            const id = userData.linkModule.LinkData[index].uniqueId
            linkArray.push(id)
            Ins_linkManager.deleteLink(id)
            index--
          }
        }
      })
      /* 清掉选中的 */
      Ref_selectedComponent.value.length = 0
      /* 假如确实有删除的连接线，重新渲染连接线 */
      if (linkArray.length > 0) {
        reRenderLink()
      }
    }
    /* 删除连接线 */
    if (userData.Ins_currentLink) {
      const id = userData.Ins_currentLink.uniqueId
      Ins_linkManager.deleteLink(id)
      reRenderLink()
    }
  }

  function reRenderLink() {
    Ins_linkManager.clearPointAndClearCurrentLink()
    Ins_linkManager.render()
  }
  watch(userData.Com_selectComponentLength, (val) => {
    userData.Ins_currentLink = null
    Ins_linkManager.clearPointAndClearCurrentLink()
  })
  return {
    hasApp,
    isSceneLoaded,
    initStage,
    Com_selectedNodes,
    userData,
    Ref_selectedComponent,
    Ins_linkManager,
  }
}
export function useStats() {
  const Ins_stats = new Stats()
  Ins_stats.showPanel(0) // 0: fps, 1: ms, 2: mb, 3+: custom
  document.body.appendChild(Ins_stats.dom)
  const update = () => {
    Ins_stats.update()
    requestAnimationFrame(update)
  }
  update()
  return Ins_stats
}
