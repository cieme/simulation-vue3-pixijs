import { watchEffect, watch } from 'vue'
import { Application, Container, Graphics, type FederatedPointerEvent } from 'pixi.js'

import { TEXT_Y, useCreateText } from '@/components/SceneCore/hooks/createText'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import type { ICreateTrackParams, ICreateTrackReturn } from '@/components/SceneCore/types/hooks'
import { addSelectedComponent } from '@/components/SceneCore/utils/index'
import {
  linkWidth,
  linkHeight,
  usePrevLink,
  useNextLink,
} from '@/components/SceneCore/link/useLink'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/ENUM_MOUSE'
import NodeItem from '../core/NodeItem'
import emitter, { E_EVENT_SCENE } from '../mitt/mitt'

export function useCreateTrack(params: ICreateTrackParams): ICreateTrackReturn {
  const { props, config, userData } = params
  const { assets, root, trackManagerNode, app } = userData
  const baseWidth = 40
  /* 盒子 */
  const container = new Container()
  container.position = config.position
  /* 图标 */
  const sprite = new Graphics()
  sprite.label = 'grapics'

  sprite.interactive = true
  sprite.cursor = 'pointer'
  const icoMouseDownHandler = (event: FederatedPointerEvent) => {
    if (event.button !== E_MOUSE_BUTTON.LEFT) return
    event.stopPropagation()
    if (event.ctrlKey) {
      addSelectedComponent(props, config)
    } else {
      addSelectedComponent(props, config, true)
    }
  }
  sprite.on('mousedown', icoMouseDownHandler)

  const { dispose: dragDispose } = useDragComponentHook({
    eventNode: sprite,
    userData,
    app,
    buttons: [E_MOUSE_BUTTON.LEFT],
    moveHandler: ({ scaleX, scaleY }) => {
      userData.Com_M_selectedNodes.value.forEach((targetNode) => {
        const position = targetNode.node.position
        targetNode.node.position.x = position.x + scaleX
        targetNode.node.position.y = position.y + scaleY
      })
      const idArray = Array.from(userData.Com_M_selectedNodes.value.keys())
      emitter.emit(E_EVENT_SCENE.MOVE_COMPONENT, idArray)
      updateLinkPosition()
    },
  })
  /* 文字 */
  const text = useCreateText()
  text.label = 'label'

  text.anchor.x = 0.5
  text.anchor.y = 1
  /**
   * 顺序比较重要, 会影响事件
   */
  container.addChild(sprite)
  trackManagerNode.addChild(container)

  const linkParams = {
    assets,
    startComponentConfig: config,
    userData,
    app,
    root,
  }

  const { node: nextLinkNode } = useNextLink(linkParams)
  const { node: prevLinkNode } = usePrevLink(linkParams)

  userData.trackLabelManagerNode.addChild(text)
  userData.trackLabelManagerNode.addChild(nextLinkNode)
  userData.trackLabelManagerNode.addChild(prevLinkNode)

  /*  */

  draw()
  drawNormal()
  /*  */
  container.on('destroyed', () => {
    sprite.off('mousedown', icoMouseDownHandler)
    dragDispose()
  })
  /*  */
  userData.M_nodeList.set(
    config.id,
    new NodeItem({
      id: config.id,
      type:config.type,
      node: container,
      nextLinkNode,
      prevLinkNode,
      iconNode: sprite,
      selectNode: sprite,
    }),
  )

  updateLinkPosition()
  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })

  /* 经过检验，销毁时，这里会销毁，不必担心内存泄漏 */
  watch(userData.Com_selectComponentLength, () => {
    let hasSelect = false
    for (const item of props.Ref_selectedComponent) {
      if (item[0] === config.id) {
        hasSelect = true
        break
      }
    }
    if (hasSelect) {
      draw()
      drawSelected()
    } else {
      draw()
      drawNormal()
    }
  })
  function updateLinkPosition() {
    const startLinkPosition = config.points[0]
    const endLinkPosition = config.points[config.points.length - 1]

    const globalStartLinkPosition = container.toGlobal({ ...startLinkPosition })
    const globalEndLinkPosition = container.toGlobal({ ...endLinkPosition })

    const localStartLinkPosition = userData.trackLabelManagerNode.toLocal(globalStartLinkPosition)
    const localEndLinkPosition = userData.trackLabelManagerNode.toLocal(globalEndLinkPosition)

    prevLinkNode.position.x = localStartLinkPosition.x
    prevLinkNode.position.y = localStartLinkPosition.y

    nextLinkNode.position.x = localEndLinkPosition.x
    nextLinkNode.position.y = localEndLinkPosition.y

    text.position.x = localEndLinkPosition.x
    text.position.y = localEndLinkPosition.y + TEXT_Y
  }

  function draw() {
    sprite.clear()
    for (let i = 0; i < config.points.length - 1; i++) {
      const startPoint = config.points[i]
      const endPoint = config.points[i + 1]
      sprite.moveTo(startPoint.x, startPoint.y)
      sprite.lineTo(endPoint.x, endPoint.y)
    }
  }
  function drawNormal() {
    sprite.stroke({
      color: 0xff0000,
      width: 10,
      join: 'round',
      cap: 'round',
    })
  }
  function drawSelected() {
    sprite.stroke({
      color: 0x00ff00,
      width: 10,
      join: 'round',
      cap: 'round',
    })
  }

  /*  */
  return {
    container,
    sprite: sprite,
    select: sprite,
    icon: sprite,
    text,
    dispose: () => {
      container.destroy({
        children: true,
        context: true,
      })
    },
  }
}
