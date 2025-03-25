import { Text, TextStyle } from 'pixi.js'

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
