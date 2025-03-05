import {
  Application,
  Graphics,
  Container,
  Point,
  Sprite,
  type FederatedPointerEvent,
} from 'pixi.js'
export default class SelectArea {
  app: Application
  root: Container
  node = new Graphics()
  width = 100
  height = 100
  startPoint = { x: 0, y: 0 }
  endPoint = { x: 0, y: 0 }
  isMouseDown = false
  constructor({ app, root }: { app: Application; root: Container }) {
    this.app = app
    this.root = root
    this.node.label = 'SelectArea'
    this.node.setStrokeStyle({
      width: 1,
      color: 0x67c23a,
      alpha: 1,
      cap: 'round',
      join: 'round',
    })
    this.node.width = this.width
    this.node.height = this.height
    this.node.setFillStyle({ color: 0x67c23a, alpha: 0.15 })
    this.init()
    const sprite = new Sprite()
    sprite.width = 100
    sprite.height = 100
    sprite.x = 0
    this.node.addChild(sprite)
  }
  init() {
    this.addEvent()
  }
  addEvent() {
    this.node.interactive = true
    this.app.stage.on('mousedown', this.onMouseDown, this)
    this.app.stage.on('mousemove', this.onMouseMove, this)
    this.app.stage.on('mouseup', this.onMouseUp, this)
    this.app.stage.on('mouseupoutside', this.onMouseUp, this)
  }
  removeEvent() {}
  onMouseDown(e: FederatedPointerEvent) {
    this.isMouseDown = true
    const { x, y } = e.global
    const localPosition = this.node.toLocal(new Point(x, y), this.node)
    this.startPoint = { x: localPosition.x, y: localPosition.y }
    console.log(this.startPoint)
  }
  onMouseMove(e: FederatedPointerEvent) {
    if (this.isMouseDown) {
      const { x, y } = e.global
      const localPosition = this.node.toLocal(new Point(x, y), this.node)
      this.endPoint = { x: localPosition.x, y: localPosition.y }
      this.drawArea()
    }
  }
  onMouseUp(e: FederatedPointerEvent) {
    this.isMouseDown = false
    this.node.clear()
  }
  globalToLocal(global: Point) {
    return this.node.toLocal(global, this.node)
  }
  drawArea() {
    const width = Math.abs(this.endPoint.x - this.startPoint.x)
    const height = Math.abs(this.endPoint.y - this.startPoint.y)
    this.node.clear()
    const start = {
      x: Math.min(this.startPoint.x, this.endPoint.x),
      y: Math.min(this.startPoint.y, this.endPoint.y),
    }
    this.node.rect(start.x, start.y, width, height)
    this.node.stroke()
    this.node.fill()
  }
}
