import { Sprite } from 'pixi.js'
import type { IBaseSceneParams } from '@SceneCore/types/hooks'
import emitter, { E_EVENT_SCENE, ENUM_TOOL } from '../mitt/mitt'
export const linkWidth = 15
export const linkHeight = 9
export function useNextLink(assets: IBaseSceneParams['assets']) {
  const texture = assets.sheet?.textures['images/icon/link_dot.png']
  const nextLink = new Sprite(texture)
  nextLink.anchor.set(0.5, 0.5)
  const tint = nextLink.tint
  const operationHandler = (status: ENUM_TOOL) => {
    if (status === ENUM_TOOL.LINE_LINK) {
      addEvent()
    } else {
      removeEvent()
    }
  }
  emitter.on(E_EVENT_SCENE.SCENE_OPERATION_STATUS, operationHandler)
  function addEvent() {
    nextLink.interactive = true
    nextLink.cursor = 'pointer'
    nextLink.on('mouseenter', () => {
      nextLink.tint = 0x407cf4
    })
    nextLink.on('mouseleave', () => {
      nextLink.tint = tint
    })
    nextLink.on('click', (e) => {
      console.log(e)
    })
  }
  function removeEvent() {
    nextLink.interactive = false

    nextLink.cursor = 'default'
    nextLink.removeAllListeners('mouseenter')
    nextLink.removeAllListeners('mouseleave')
    nextLink.removeAllListeners('click')
  }
  function unEmit() {
    emitter.off(E_EVENT_SCENE.SCENE_OPERATION_STATUS, operationHandler)
  }
  function dispose() {
    unEmit()
    removeEvent()
  }
  nextLink.on('destroyed', dispose)
  return {
    node: nextLink,
    addEvent,
    removeEvent,
    dispose,
    unEmit,
  }
}
