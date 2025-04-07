import { reactive } from 'vue'
import { Container, Sprite } from 'pixi.js'
import type { IBaseComponent } from '@/components/SceneCore/types/base'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import emitter, { E_EVENT_SCENE, ENUM_TOOL, ENUM_LINK_TYPE } from '../mitt/mitt'
export const linkWidth = 15
export const linkHeight = 9
interface ILinkParams {
  status: ENUM_LINK_TYPE | null
  startComponentConfig: IBaseComponent | null
  reset: () => void
}
export const linkReactive = reactive<ILinkParams>({
  status: null,
  startComponentConfig: null,
  reset: () => {
    linkReactive.status = null
    linkReactive.startComponentConfig = null
  },
})

export interface IUseLinkParams {
  assets: IBaseSceneParams['assets']
  /* 判断当前链接组件的 */
  startComponentConfig: ILinkParams['startComponentConfig'] | null
}
export function useNextLink({ assets, startComponentConfig }: IUseLinkParams) {
  const texture = assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
  nextLink.anchor.set(0.5, 0.5)
  const tint = nextLink.tint
  const operationHandler = (status: ENUM_TOOL) => {
    if (status === ENUM_TOOL.LINE_LINK) {
      addLinkEvent()
    } else {
      removeLinkEvent()
    }
  }

  function addLinkEvent() {
    nextLink.interactive = true
    nextLink.cursor = 'pointer'
    nextLink.on('mouseenter', () => {
      nextLink.tint = 0x407cf4
    })
    nextLink.on('mouseleave', () => {
      nextLink.tint = tint
    })
    nextLink.on('click', (e) => {
      /* 如果是第一次进入连线状态 */
      if (linkReactive.status === null) {
        linkReactive.status = ENUM_LINK_TYPE.LINK_IN
        linkReactive.startComponentConfig = startComponentConfig
        emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_IN)
      }
    })
  }
  function removeLinkEvent() {
    nextLink.interactive = false

    nextLink.cursor = 'default'
    nextLink.removeAllListeners('mouseenter')
    nextLink.removeAllListeners('mouseleave')
    nextLink.removeAllListeners('click')
  }
  function onEmit() {
    emitter.on(E_EVENT_SCENE.SCENE_OPERATION_STATUS, operationHandler)
  }
  onEmit()
  function unEmit() {
    emitter.off(E_EVENT_SCENE.SCENE_OPERATION_STATUS, operationHandler)
  }
  function dispose() {
    unEmit()
    removeLinkEvent()
  }
  nextLink.on('destroyed', dispose)
  return {
    node: nextLink,
    addLinkEvent,
    removeLinkEvent,
    dispose,
    unEmit,
  }
}
export function usePrevLink({ assets, startComponentConfig }: IUseLinkParams) {
  const texture = assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
  nextLink.anchor.set(0.5, 0.5)
  const tint = nextLink.tint

  function onLinkIn(type: ENUM_LINK_TYPE) {
    if (type === ENUM_LINK_TYPE.LINK_IN) {
      addLinkEvent()
    } else {
      removeLinkEvent()
    }
  }

  function onEmit() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, onLinkIn)
  }
  onEmit()
  function unEmit() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, onLinkIn)
  }
  /*  */
  function addLinkEvent() {
    nextLink.interactive = true
    nextLink.cursor = 'pointer'
    nextLink.on('mouseenter', () => {
      nextLink.tint = 0x407cf4
    })
    nextLink.on('mouseleave', () => {
      nextLink.tint = tint
    })
    nextLink.on('click', (e) => {
      /* 不能链接自己 */
      if (
        startComponentConfig &&
        linkReactive.startComponentConfig &&
        startComponentConfig.id === linkReactive.startComponentConfig.id
      ) {
        console.log('不能链接自己')
      } else {
        console.log(
          `终点：${startComponentConfig?.id}，起点：${linkReactive.startComponentConfig?.id}`,
        )
      }
    })
  }
  function removeLinkEvent() {
    nextLink.interactive = false
    nextLink.cursor = 'default'
    nextLink.removeAllListeners('mouseenter')
    nextLink.removeAllListeners('mouseleave')
    nextLink.removeAllListeners('click')
  }

  /*  */

  function dispose() {
    unEmit()
    removeLinkEvent()
  }
  nextLink.on('destroyed', dispose)
  return {
    node: nextLink,
    addLinkEvent,
    removeLinkEvent,
    dispose,
    unEmit,
  }
}
