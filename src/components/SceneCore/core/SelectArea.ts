import { Application, Graphics, Container, Point, FederatedPointerEvent } from 'pixi.js'
import type { IBaseSceneParams } from '@SceneCore/types/hooks'
import { useGlobalToLocal } from '@/components/SceneCore/hooks/index'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/mouse'
import emitter, { E_EVENT_SCENE } from '@SceneCore/mitt/mitt'
export default class SelectArea {
  props: any
  app: Application
  root: Container
  node = new Graphics()
  width = 100
  height = 100
  startPoint = { x: 0, y: 0 }
  endPoint = { x: 0, y: 0 }
  isMouseDown = false
  color = 0x67c23a
  gap = 10
  constructor({ app, root, props }: IBaseSceneParams) {
    this.app = app
    this.root = root
    this.props = props
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
    if (e.button !== E_MOUSE_BUTTON.LEFT) return
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
      const data = this.getArea()
      if (data.width < this.gap && data.height < this.gap) return
      this.drawArea(data)
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
  drawArea(data: ReturnType<typeof this.getArea>) {
    const { width, height, startPoint } = data
    this.node.clear()
    this.node.rect(startPoint.x, startPoint.y, width, height)
    this.node.stroke()
    this.node.fill()
    this.checkoutArea(data)
    emitter.emit(E_EVENT_SCENE.BoxSelection, data)
  }
  checkoutArea(data: ReturnType<typeof this.getArea>) {
    const { width, height } = data
  }
}
