import { Container, Graphics } from 'pixi.js'

export default class LinkPoint {
  node: Graphics = new Graphics()
  parentNode: Container
  constructor(parentNode: Container) {
    this.init()
    this.parentNode = parentNode
    this.parentNode.addChild(this.node)
  }
  init() {
    /* 绘制一个 8*8 的红色矩形 */
    this.node.rect(0, 0, 8, 8)
    this.node.fill({
      color: 0xff0000,
    })
  }
}
