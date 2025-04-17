import { Text, TextStyle, Sprite, Assets, Texture, BitmapFont, BitmapText } from 'pixi.js'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
export const TEXT_Y = 10
export function useCreateText(): BitmapText {
  const _textStyle = new TextStyle({
    fontSize: 14,
    lineHeight: 16,
    fill: 0xffffff,
    fontFamily: '黑体',
    align: 'center',
  })
  const text = new BitmapText({
    style: _textStyle,
  })
  text.anchor.x = 0.5
  text.anchor.y = 1
  return text
}
export function useCreateLabelNode(): Sprite {
  const label = new Sprite()

  return label
}
export function useCreateLabelText(
  text: string,
  assets: IBaseSceneParams['userData']['assets'],
): Texture | undefined {
  const texture = assets.sheet?.textures[`images/label_number/${text}.png`]
  return texture
}
