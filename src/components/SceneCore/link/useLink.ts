import { Sprite } from 'pixi.js'

import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import type { ILinkParams } from '@/components/SceneCore/types/link'
import { Link } from '@/components/SceneCore/link/Link'
import emitter, { E_EVENT_SCENE, ENUM_TOOL, ENUM_LINK_TYPE } from '../mitt/mitt'

import { uuid } from '@/utils'
export const linkWidth = 15
export const linkHeight = 9

// export const linkReactive = reactive<ILinkParams>({
//   status: null,
//   startComponentConfig: null,
//   link: null,
//   reset: () => {
//     linkReactive.status = null
//     linkReactive.startComponentConfig = null
//     linkReactive.link = null
//   },
// })

export interface IUseLinkParams {
  assets: IBaseSceneParams['assets']
  /* 判断当前链接组件的 */
  startComponentConfig: ILinkParams['startComponentConfig'] | null
  userData: IBaseSceneParams['userData']
}
export function useNextLink({ assets, startComponentConfig, userData }: IUseLinkParams) {
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
      if (userData.linkReactive.status === null) {
        userData.linkReactive.status = ENUM_LINK_TYPE.LINK_IN
        userData.linkReactive.startComponentConfig = startComponentConfig
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
export function usePrevLink({ assets, startComponentConfig, userData }: IUseLinkParams) {
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
        userData.linkReactive.startComponentConfig &&
        startComponentConfig.id === userData.linkReactive.startComponentConfig.id
      ) {
        console.log('不能链接自己')
      } else {
        const link = new Link({
          uniqueId: uuid(),
          start: userData.linkReactive.startComponentConfig!.id,
        })
        link.end = startComponentConfig!.id
        userData.linkReactive.LinkData.push(link)
        emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_SUCCESS)

        console.log(
          `终点：${startComponentConfig?.id}，起点：${userData.linkReactive.startComponentConfig?.id}`,
        )
        userData.linkReactive.reset()
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
