import { watchEffect, watch } from 'vue'
import { Application, Container, Graphics, type FederatedPointerEvent } from 'pixi.js'

import { useCreateText } from '@/components/SceneCore/hooks/createText'
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
  const { props, config, assets, userData, app, root } = params
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
      userData.selectedNodes.value.forEach((targetNode) => {
        const position = targetNode.node.position
        targetNode.node.position.x = position.x + scaleX
        targetNode.node.position.y = position.y + scaleY
      })
      const idArray = userData.selectedComponent.value.map((item) => item.id)
      emitter.emit(E_EVENT_SCENE.MOVE_COMPONENT, idArray)
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
  container.addChild(text)

  const linkParams = {
    assets,
    startComponentConfig: config,
    userData,
    app,
    root,
  }

  const { node: nextLinkNode } = useNextLink(linkParams)
  const { node: prevLinkNode } = usePrevLink(linkParams)
  updateLinkPosition()
  container.addChild(nextLinkNode)
  container.addChild(prevLinkNode)
  draw()
  drawNormal()
  /*  */
  container.on('destroyed', () => {
    sprite.off('mousedown', icoMouseDownHandler)
    dragDispose()
  })
  /*  */
  userData.nodeList.set(
    config.id,
    new NodeItem({
      id: config.id,
      node: container,
      nextLinkNode,
      prevLinkNode,
      iconNode: sprite,
      selectNode: sprite,
    }),
  )

  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })

  /* 经过检验，销毁时，这里会销毁，不必担心内存泄漏 */
  watch(userData.selectComponentLength, () => {
    let hasSelect = false
    for (const item of props.selectedComponent) {
      if (item.id === config.id) {
        hasSelect = true
        break
      }
    }
    console.log(hasSelect)
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
    prevLinkNode.position.x = startLinkPosition.x
    prevLinkNode.position.y = startLinkPosition.y

    nextLinkNode.position.x = endLinkPosition.x
    nextLinkNode.position.y = endLinkPosition.y

    text.position.x = endLinkPosition.x
    text.position.y = endLinkPosition.y + 24
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
    addToScene: (app: Application) => {
      root.addChild(container)
    },
    dispose: () => {
      container.destroy({
        children: true,
        texture: true,
        context: true,
        // textureSource: true, // 其他组件可能会用，不在这删
        style: true,
      })
    },
  }
}
