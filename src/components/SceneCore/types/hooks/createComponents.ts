import type { Application, Container, Sprite, Text } from 'pixi.js'

export interface ICreateNodeReturn {
  container: Container
  sprite: Sprite
  select: Sprite
  icon: Sprite
  text: Text
  addToScene: (app: Application) => void
  dispose: () => void
}
