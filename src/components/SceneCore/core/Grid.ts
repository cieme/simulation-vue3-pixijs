import { Graphics } from 'pixi.js'
export default class Grid {
  node = new Graphics()
  gap = 20
  width = 100000
  height = 100000
  constructor() {
    this.node.label = 'Grid'
    this.node.setStrokeStyle({ width: 2, color: 0x888888, alpha: 0.15 })
    this.node.position.x = -this.width / 2
    this.node.position.y = -this.height / 2
    this.init()
  }
  init() {
    this.drawGrid()
    /**
     * 为了点击事件
     */
    this.drawBg()
  }
  drawGrid() {
    const width = this.width
    const height = this.height
    for (let i = 0; i <= width; i += this.gap) {
      this.node.moveTo(i, 0)
      this.node.lineTo(i, height)
    }
    for (let i = 0; i <= height; i += this.gap) {
      this.node.moveTo(0, i)
      this.node.lineTo(width, i)
    }
    this.node.stroke()
  }
  drawBg() {
    const width = this.width
    const height = this.height
    this.node.rect(0, 0, width, height)
    this.node.setFillStyle({
      color: 0x222222,
      alpha: 0.1,
    })
    this.node.fill()
  }
}
