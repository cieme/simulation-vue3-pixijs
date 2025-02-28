import { watchEffect } from 'vue'
import { Application, Container, Text, TextStyle, Sprite, Assets } from 'pixi.js'
import { type IAssets } from './assets'
export function useCreateNode({
  props,
  config,
  assets,
  root,
}: {
  props: any
  config: any
  assets: IAssets
  root: Container
}) {
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
  icon.on('click', (event) => {
    event.stopPropagation()
    props.selectedComponent.push(config.id)
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

  container.addChild(sprite)
  container.addChild(icon)
  container.addChild(select)
  container.addChild(text)

  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })
  watchEffect(() => {
    const hasSelect = props.selectedComponent.find((item: number) => {
      return item === config.id
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

export function useRootContainer() {
  const root = new Container()
  root.label = 'root'
  return { root }
}
