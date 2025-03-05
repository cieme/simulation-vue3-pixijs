import { Application, Graphics, Container, Point, FederatedPointerEvent } from 'pixi.js'
import { useGlobalToLocal } from '@/components/SceneCore/hooks/index'
import { MouseButton } from '@/components/SceneCore/enum/mouse'
export default class SelectArea {
  app: Application
  root: Container
  node = new Graphics()
  width = 100
  height = 100
  startPoint = { x: 0, y: 0 }
  endPoint = { x: 0, y: 0 }
  isMouseDown = false
  color = 0x67c23a
  constructor({ app, root }: { app: Application; root: Container }) {
    this.app = app
    this.root = root
    this.node.label = 'SelectArea'
    /*  */
    this.init()
    this.addEvent()
  }
  init() {
    this.node.setStrokeStyle({
      width: 1,
      color: this.color,
      alpha: 1,
      cap: 'round',
      join: 'round',
    })
    this.node.width = this.width
    this.node.height = this.height
    this.node.setFillStyle({ color: this.color, alpha: 0.15 })
  }
  addEvent() {
    this.node.interactive = true
    this.app.stage.on('mousedown', this.onMouseDown, this)
    this.app.stage.on('mouseup', this.onMouseUp, this)
    this.app.stage.on('mouseupoutside', this.onMouseUp, this)
  }
  removeEvent() {
    this.app.stage.off('mousedown', this.onMouseDown, this)
    this.app.stage.off('mouseup', this.onMouseUp, this)
    this.app.stage.off('mouseupoutside', this.onMouseUp, this)
    /*  */
    this.app.stage.off('mousemove', this.onMouseMove, this)
  }
  onMouseDown(e: FederatedPointerEvent) {
    /* 如果不是左键，不处理 */
    console.log(e.button)

    e.stopPropagation()
    e.preventDefault()
    if (e.button !== 0) return
    this.isMouseDown = true
    const { appPoint } = useGlobalToLocal({
      globalPoint: e.global,
      node: this.node,
      app: this.app,
    })
    this.startPoint = appPoint
    this.app.stage.on('mousemove', this.onMouseMove, this)
  }
  onMouseMove(e: FederatedPointerEvent) {
    if (this.isMouseDown) {
      const { appPoint } = useGlobalToLocal({
        globalPoint: e.global,
        node: this.node,
        app: this.app,
      })
      this.endPoint = appPoint
      this.drawArea()
    }
  }
  onMouseUp(e: FederatedPointerEvent) {
    this.isMouseDown = false
    this.app.stage.off('mousemove', this.onMouseMove, this)
    this.node.clear()
  }
  globalToLocal(global: Point) {
    return this.node.toLocal(global, this.node)
  }
  getArea() {
    const width = Math.abs(this.endPoint.x - this.startPoint.x)
    const height = Math.abs(this.endPoint.y - this.startPoint.y)
    const startPoint = {
      x: Math.min(this.startPoint.x, this.endPoint.x),
      y: Math.min(this.startPoint.y, this.endPoint.y),
    }
    const endPoint = {
      x: Math.max(this.startPoint.x, this.endPoint.x),
      y: Math.max(this.startPoint.y, this.endPoint.y),
    }
    return { width, height, startPoint, endPoint }
  }
  drawArea() {
    const { width, height, startPoint } = this.getArea()
    this.node.clear()
    this.node.rect(startPoint.x, startPoint.y, width, height)
    this.node.stroke()
    this.node.fill()
  }
}
