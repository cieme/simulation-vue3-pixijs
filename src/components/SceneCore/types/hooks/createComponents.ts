import type { Application, Container, Sprite, BitmapText,Graphics } from 'pixi.js'

export interface ICreateNodeReturn {
  container: Container
  sprite: Sprite
  select: Sprite
  icon: Sprite
  text: BitmapText
  dispose: () => void
}
export interface ICreateTrackReturn {
  container: Container
  sprite: Graphics
  select: Graphics
  icon: Graphics
  text: BitmapText
  dispose: () => void
}
