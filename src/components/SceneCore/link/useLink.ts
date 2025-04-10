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
  assets: IBaseSceneParams['assets']
  /* 判断当前链接组件的 */
  startComponentConfig: ILinkParams['startComponentConfig'] | null
  userData: IBaseSceneParams['userData']
  app: Application
  root: IBaseSceneParams['root']
}
const cancelArray = [ENUM_LINK_TYPE.LINK_CANCEL, ENUM_LINK_TYPE.LINK_SUCCESS]
export function useNextLink({ assets, startComponentConfig, userData, app, root }: IUseLinkParams) {
  const texture = assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
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
      if (userData.linkReactive.status === null) {
        userData.linkReactive.status = ENUM_LINK_TYPE.LINK_IN
        userData.linkReactive.startComponentConfig = startComponentConfig

        const link = new Link({ uniqueId: uuid(), start: startComponentConfig!.id })
        userData.linkReactive.linking = link
        const { dispose: AppDispose } = appLink({
          link,
          userData,
          app,
          root,
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
export function usePrevLink({ assets, startComponentConfig, userData, app }: IUseLinkParams) {
  const texture = assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
  nextLink.anchor.set(0.5, 0.5)

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
    nextLink.interactive = true
    nextLink.cursor = 'pointer'

    nextLink.on('mousedown', (e) => {
      if (e.button !== E_MOUSE_BUTTON.LEFT) return
      e.stopPropagation()
      /* 不能链接自己 */
      if (
        startComponentConfig &&
        userData.linkReactive.startComponentConfig &&
        startComponentConfig.id === userData.linkReactive.startComponentConfig.id
      ) {
        console.log('不能链接自己')
      } else {
        const link = userData.linkReactive.linking
        if (link) {
          link.end = startComponentConfig!.id
          userData.linkReactive.LinkData.push(link)
          emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_SUCCESS)
          userData.linkReactive.reset()
        }
      }
    })
  }
  function removeLinkEvent() {
    nextLink.interactive = false
    nextLink.cursor = 'default'
    nextLink.removeAllListeners('mousedown')
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

export function appLink({
  link,
  userData,
  app,
  root,
}: {
  link: Link
  userData: IBaseSceneParams['userData']
  app: Application
  root: IBaseSceneParams['root']
}) {
  const onMouseDown = (e: FederatedPointerEvent) => {
    if (e.button === E_MOUSE_BUTTON.LEFT) {
      const mouseX = e.global.x
      const mouseY = e.global.y
      const point = { x: mouseX, y: mouseY }
      /*  */
      const LinkManager = root.getChildByLabel('LinkManager')

      const localPoint = LinkManager!.toLocal(point)
      link.point.push(localPoint)
      /*  */
      emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_ING)
    }
  }
  const onRightDown = (e: FederatedPointerEvent) => {
    emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_CANCEL)
    userData.linkReactive.reset()
    dispose()
  }
  const pointerMove = throttleForResize<FederatedPointerEvent>((e) => {
    const mouseX = e.global.x
    const mouseY = e.global.y
    link.linking = { x: mouseX, y: mouseY }
    emitter.emit(E_EVENT_SCENE.LINK_STATUS, ENUM_LINK_TYPE.LINK_ING)
  }, 30)

  app.stage.on('mousedown', onMouseDown)
  app.stage.on('rightdown', onRightDown)
  app.stage.on('mousemove', pointerMove)

  const dispose = () => {
    app.stage.off('mousedown', onMouseDown)
    app.stage.off('rightdown', onRightDown)
    app.stage.off('mousemove', pointerMove)
  }
  return {
    dispose,
  }
}
