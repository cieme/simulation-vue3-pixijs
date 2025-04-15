import { Text, TextStyle, Sprite, Assets, Texture } from 'pixi.js'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
export function useCreateText(): Text {
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
  return text
}
export function useCreateLabelNode(): Sprite {
  const label = new Sprite()

  return label
}
export function useCreateLabelText(
  text: string,
  assets: IBaseSceneParams['assets'],
): Texture | undefined {
  const texture = assets.sheet?.textures[`images/label_number/${text}.png`]
  return texture
}
