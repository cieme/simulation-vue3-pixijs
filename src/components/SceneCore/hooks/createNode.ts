import { watchEffect } from 'vue'
import {
  Application,
  Container,
  Text,
  TextStyle,
  Sprite,
  type FederatedPointerEvent,
} from 'pixi.js'

import { useDragComponentHook } from '@/components/SceneCore/eventhooks/mousehook'
import type { IAssets, ICreateNodeParams } from '@/components/SceneCore/types/hooks'
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
  icon.on('mousedown', (event: FederatedPointerEvent) => {
    event.stopPropagation()
    if (event.ctrlKey) {
      pushCurrent()
    } else {
      pushCurrent(true)
    }
  })

  function pushCurrent(clear = false) {
    const hasId = props.selectedComponent.some((item: any) => item.id === config.id)
    if (hasId) {
      return
    } else {
      if (clear) {
        props.selectedComponent.length = 0
      }
      props.selectedComponent.push(config)
    }
  }
  useDragComponentHook({
    eventNode: icon,
    userData,
    root,
    app,
    props,
  })
  /* 文字 */
  const _textStyle = new TextStyle({
    fontSize: 14,
    lineHeight: 16,
    fill: 0xffffff,
    fontFamily: 'Arial',
    align: 'center',
  })
  const text = new Text({
    style: _textStyle,
  })
  text.position.y = baseWidth
  text.anchor.x = 0.5
  text.anchor.y = 0.5
  /**
   * 顺序比较重要, 会影响事件
   */
  container.addChild(sprite)
  container.addChild(select)
  container.addChild(icon)
  container.addChild(text)
  /*  */
  userData.nodeList.set(config.id, container)

  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })
  watchEffect(() => {
    const hasSelect = props.selectedComponent.find((item: any) => {
      return item.id === config.id
    })
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
