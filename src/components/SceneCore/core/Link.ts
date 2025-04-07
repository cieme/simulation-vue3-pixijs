import { Graphics, Container, Polygon } from 'pixi.js'

export default class Link {
  node = new Container()
  graphics = new Graphics()
  PolygonList: Array<{ id: string; polygon: Polygon }> = []

  constructor() {
    this.node.label = 'Link'
    this.node.addChild(this.graphics)
  }
  init() {
    // strokeContains
  }
}
