import { watchEffect, watch, computed } from 'vue'
import { Application, Container, Sprite, type FederatedPointerEvent } from 'pixi.js'

import { useCreateText } from '@/components/SceneCore/hooks/createText'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import { addSelectedComponent } from '@/components/SceneCore/utils/index'
import { linkWidth, usePrevLink, useNextLink } from '@/components/SceneCore/link/useLink'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/mouse'
import NodeItem from '../core/NodeItem'
import emitter, { E_EVENT_SCENE } from '../mitt/mitt'
/**
 * 创建通用节点
 *
 * @export
 * @param {ICreateNodeParams} param0
 * @param {ICreateNodeParams} param0.props
 * @param {ICreateNodeParams} param0.config
 * @param {ICreateNodeParams} param0.assets
 * @param {ICreateNodeParams} param0.root
 * @param {ICreateNodeParams} param0.app
 * @param {ICreateNodeParams} param0.userData
 * @returns {{ container: any; sprite: any; select: any; icon: any; text: any; addToScene: (app: Application) => void; }}
 */
export function useCreateNode({ props, config, assets, root, app, userData }: ICreateNodeParams) {
  const baseWidth = 40
  /* 盒子 */
  const container = new Container()
  container.position = config.position
  /* 图标 */
  const sprite = new Sprite()
  sprite.width = baseWidth
  sprite.height = baseWidth
  sprite.anchor.x = 0.5
  sprite.anchor.y = 0.5
  sprite.tint = 0x383e50
  const texture = assets.sheet?.textures['images/icon/default.png']
  sprite.texture = texture!

  const icon = new Sprite()
  icon.label = 'icon'
  icon.width = baseWidth
  icon.height = baseWidth
  icon.anchor.x = 0.5
  icon.anchor.y = 0.5
  const iconTexture = assets.sheet?.textures['images/source/icon_source_000.png']
  icon.texture = iconTexture!

  const select = new Sprite()
  select.width = baseWidth
  select.height = baseWidth
  select.anchor.x = 0.5
  select.anchor.y = 0.5
  select.tint = 0x407cf4
  const selectTexture = assets.sheet?.textures['images/icon/selected-9.png']
  select.texture = selectTexture!
  select.visible = false

  icon.interactive = true
  icon.cursor = 'pointer'
  const icoMouseDownHandler = (event: FederatedPointerEvent) => {
    if (event.button !== E_MOUSE_BUTTON.LEFT) return
    event.stopPropagation()
    if (event.ctrlKey) {
      addSelectedComponent(props, config)
    } else {
      addSelectedComponent(props, config, true)
    }
  }
  icon.on('mousedown', icoMouseDownHandler)

  const { dispose: dragDispose } = useDragComponentHook({
    eventNode: icon,
    userData,
    app,
    buttons: [E_MOUSE_BUTTON.LEFT],
    moveHandler: ({ scaleX, scaleY }) => {
      userData.selectedNodes.value.forEach((targetNode) => {
        const position = targetNode.node.position
        targetNode.node.position.x = position.x + scaleX
        targetNode.node.position.y = position.y + scaleY
      })
      emitter.emit(E_EVENT_SCENE.MOVE_COMPONENT, [])
    },
  })
  /* 文字 */
  const text = useCreateText()
  text.position.y = baseWidth
  text.anchor.x = 0.5
  text.anchor.y = 1
  /**
   * 顺序比较重要, 会影响事件
   */
  container.addChild(sprite)
  container.addChild(select)
  container.addChild(icon)
  container.addChild(text)

  const linkParams = {
    assets,
    startComponentConfig: config,
    userData,
    app,
    root,
  }
  const { node: nextLinkNode } = useNextLink(linkParams)
  nextLinkNode.position.x = 20 + linkWidth / 2
  container.addChild(nextLinkNode)
  const { node: prevLinkNode } = usePrevLink(linkParams)
  prevLinkNode.position.x = -20 - linkWidth / 2
  container.addChild(prevLinkNode)
  /*  */
  container.on('destroyed', () => {
    icon.off('mousedown', icoMouseDownHandler)
    dragDispose()
  })
  /*  */
  userData.nodeList.set(
    config.id,
    new NodeItem({
      node: container,
      nextLinkNode,
      prevLinkNode,
      iconNode: icon,
      selectNode: select,
    }),
  )

  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })
  const selectLength = computed(() => {
    return props.selectedComponent.length
  })
  /* 经过检验，销毁时，这里会销毁，不必担心内存泄漏 */
  watch(selectLength, () => {
    let hasSelect = false
    for (const item of props.selectedComponent) {
      if (item.id === config.id) {
        hasSelect = true
        break
      }
    }
    if (hasSelect) {
      select.visible = true
    } else {
      select.visible = false
    }
  })

  /*  */
  return {
    container,
    sprite,
    select,
    icon,
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

/**
 * 使用根节点容器
 *
 * @export
 * @returns {{ root: any; }}
 */
export function useRootContainer() {
  const root = new Container()
  root.label = 'root'
  return { root }
}
