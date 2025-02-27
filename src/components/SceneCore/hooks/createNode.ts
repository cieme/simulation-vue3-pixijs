import { watchEffect } from 'vue'
import { Application, Container, Text, TextStyle, Sprite, Assets } from 'pixi.js'
import { type IAssets } from './assets'
export function useCreateNode({
  config,
  assets,
  root,
}: {
  config: any
  assets: IAssets
  root: Container
}) {
  const baseWidth = 40
  /* 盒子 */
  const container = new Container()
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
  container.addChild(text)

  watchEffect(() => {
    container.label = config.label
    text.text = config.label
  })
  /*  */
  return {
    container,
    addToScene: (app: Application) => {
      root.addChild(container)
    },
  }
}
