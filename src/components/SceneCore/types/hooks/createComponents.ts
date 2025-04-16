import type { Application, Container, Sprite, Text,Graphics } from 'pixi.js'

export interface ICreateNodeReturn {
  container: Container
  sprite: Sprite
  select: Sprite
  icon: Sprite
  text: Text
  addToScene: (app: Application) => void
  dispose: () => void
}
export interface ICreateTrackReturn {
  container: Container
  sprite: Graphics
  select: Graphics
  icon: Graphics
  text: Text
  addToScene: (app: Application) => void
  dispose: () => void
}
