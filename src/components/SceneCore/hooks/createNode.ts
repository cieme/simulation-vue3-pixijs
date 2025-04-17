import { watchEffect, watch } from 'vue'
import { Application, Container, Sprite, type FederatedPointerEvent } from 'pixi.js'

import { TEXT_Y, useCreateText } from '@/components/SceneCore/hooks/createText'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import type {
  ICreateNodeParams,
  ICreateSourceParams,
  ICreateNodeReturn,
} from '@/components/SceneCore/types/hooks'
import { addSelectedComponent } from '@/components/SceneCore/utils/index'
import { linkWidth, usePrevLink, useNextLink } from '@/components/SceneCore/link/useLink'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/ENUM_MOUSE'
import NodeItem from '../core/NodeItem'
import emitter, { E_EVENT_SCENE } from '../mitt/mitt'

/**
 * Description placeholder
 *
 * @export
 * @param {ICreateNodeParams} param0
 * @param {ICreateNodeParams} param0.props
 * @param {ICreateNodeParams} param0.config
 * @param {ICreateNodeParams} param0.assets
 * @param {ICreateNodeParams} param0.root
 * @param {ICreateNodeParams} param0.app
 * @param {ICreateNodeParams} param0.userData
 * @returns {{ container: any; sprite: any; select: any; icon: any; text: any; addToScene: (app: Application) => void; dispose: () => void; }}
 */

export function useCreateNode(params: ICreateSourceParams): ICreateNodeReturn
export function useCreateNode(params: ICreateNodeParams): ICreateNodeReturn {
  const { props, config, userData } = params
  const { assets, root, app } = userData
  const baseWidth = 40
  /* 盒子 */
  const container = new Container()
  container.position = config.position
  /* 图标 */
  const sprite = new Sprite()
  sprite.label = 'bg'
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
  select.label = 'select'
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
      const idArray = userData.selectedComponent.value.map((item) => item.id)
      emitter.emit(E_EVENT_SCENE.MOVE_COMPONENT, idArray)
    },
  })
  /* 文字 */
  const text = useCreateText()
  text.label = 'label'
  text.position.y = baseWidth / 2 + TEXT_Y

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
      id: config.id,
      node: container,
      nextLinkNode,
      prevLinkNode,
      iconNode: icon,
      selectNode: select,
    }),
  )
  root.addChild(container)
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
    dispose: () => {
      container.destroy({
        children: true,
        context: true,
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
export function useRootContainer(label?: string) {
  const node = new Container()
  node.label = label || 'root'
  return { node }
}
