import { Application, Sprite, type FederatedPointerEvent } from 'pixi.js'

import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import type { ILinkParams } from '@/components/SceneCore/types/link'
import { Link } from '@/components/SceneCore/link/Link'
import emitter, { E_EVENT_SCENE, ENUM_TOOL, ENUM_LINK_TYPE } from '../mitt/mitt'

import { throttleForResize, uuid } from '@/utils'
import { E_MOUSE_BUTTON } from '../enum/ENUM_MOUSE'
export const linkWidth = 15
export const linkHeight = 9

export interface IUseLinkParams {
  /* 判断当前链接组件的 */
  startComponentConfig: ILinkParams['startComponentConfig'] | null
  userData: IBaseSceneParams['userData']
}
const cancelArray = [ENUM_LINK_TYPE.LINK_CANCEL, ENUM_LINK_TYPE.LINK_SUCCESS]
export function useNextLink({ startComponentConfig, userData }: IUseLinkParams) {
  const texture = userData.assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
  nextLink.label = 'nextLink'
  // nextLink.tint = 0x76efff
  nextLink.anchor.set(0.5, 0.5)

  const operationHandler = (status: ENUM_TOOL) => {
    if (status === ENUM_TOOL.LINE_LINK) {
      addLinkEvent()
    } else {
      removeLinkEvent()
    }
  }

  let AppDisposeHandler: () => void | undefined

  function addLinkEvent() {
    nextLink.interactive = true
    nextLink.cursor = 'pointer'

    nextLink.on('mousedown', (e) => {
      if (e.button !== E_MOUSE_BUTTON.LEFT) return
      e.stopPropagation()
      /* 如果是第一次进入连线状态 */
      if (userData.linkModule.status === null) {
        userData.linkModule.status = ENUM_LINK_TYPE.LINK_IN
        userData.linkModule.startComponentConfig = startComponentConfig

        const link = new Link({ uniqueId: uuid(), start: startComponentConfig!.id })
        userData.linkModule.linking = link
        const { dispose: AppDispose } = appLink({
          link,
          userData,
        })
        AppDisposeHandler = AppDispose
        onEmitLinkSuccessOrCancel()
        emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_IN)
      }
    })
  }
  function onEmitLinkSuccessOrCancel() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, onLinkOut)
  }
  function offEmitLinkSuccessOrCancel() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, onLinkOut)
  }
  function onLinkOut(status: ENUM_LINK_TYPE) {
    if (cancelArray.includes(status)) {
      if (AppDisposeHandler) {
        AppDisposeHandler()
      }
    }
  }
  function removeLinkEvent() {
    nextLink.interactive = false

    nextLink.cursor = 'default'
    nextLink.removeAllListeners('mousedown')
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
    offEmitLinkSuccessOrCancel()
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
export function usePrevLink({ startComponentConfig, userData }: IUseLinkParams) {
  const texture = userData.assets.sheet?.textures['images/icon/link_dot.png']
  const prevLink = new Sprite(texture)
  prevLink.label = 'prevLink'
  // prevLink.tint = 0xea5480
  prevLink.anchor.set(0.5, 0.5)

  function onLinkIn(type: ENUM_LINK_TYPE) {
    if (type === ENUM_LINK_TYPE.LINK_IN) {
      addLinkEvent()
    } else if (cancelArray.includes(type)) {
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
    prevLink.interactive = true
    prevLink.cursor = 'pointer'

    prevLink.on('mousedown', (e) => {
      if (e.button !== E_MOUSE_BUTTON.LEFT) return
      e.stopPropagation()
      /* 不能链接自己 */
      if (
        startComponentConfig &&
        userData.linkModule.startComponentConfig &&
        startComponentConfig.id === userData.linkModule.startComponentConfig.id
      ) {
        console.log('不能链接自己')
      } else {
        const link = userData.linkModule.linking
        if (link) {
          link.end = startComponentConfig!.id
          userData.linkModule.LinkData.push(link)
          emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_SUCCESS)
          userData.linkModule.reset()
        }
      }
    })
  }
  function removeLinkEvent() {
    prevLink.interactive = false
    prevLink.cursor = 'default'
    prevLink.removeAllListeners('mousedown')
  }

  /*  */

  function dispose() {
    console.log('prev 销毁')
    unEmit()
    removeLinkEvent()
  }
  prevLink.on('destroyed', dispose)
  return {
    node: prevLink,
    addLinkEvent,
    removeLinkEvent,
    dispose,
    unEmit,
  }
}

export function appLink({
  link,
  userData,
}: {
  link: Link
  userData: IBaseSceneParams['userData']
}) {
  const onMouseDown = (e: FederatedPointerEvent) => {
    if (e.button === E_MOUSE_BUTTON.LEFT) {
      const mouseX = e.global.x
      const mouseY = e.global.y
      const point = { x: mouseX, y: mouseY }
      /*  */
      const LinkManager = userData.root.getChildByLabel('LinkManager')

      const localPoint = LinkManager!.toLocal(point)
      link.point.push(localPoint)
      /*  */
      emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_ING)
    }
  }
  const onRightDown = (e: FederatedPointerEvent) => {
    emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_CANCEL)
    userData.linkModule.reset()
    dispose()
  }
  const pointerMove = throttleForResize<FederatedPointerEvent>((e) => {
    const mouseX = e.global.x - 3
    const mouseY = e.global.y - 3
    link.linking = { x: mouseX, y: mouseY }
    emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_ING)
  }, 30)

  userData.app.stage.on('mousedown', onMouseDown)
  userData.app.stage.on('rightdown', onRightDown)
  userData.app.stage.on('mousemove', pointerMove)

  const dispose = () => {
    userData.app.stage.off('mousedown', onMouseDown)
    userData.app.stage.off('rightdown', onRightDown)
    userData.app.stage.off('mousemove', pointerMove)
  }
  return {
    dispose,
  }
}
