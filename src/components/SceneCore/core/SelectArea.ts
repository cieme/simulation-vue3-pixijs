import { Rectangle, Graphics, Container, Point, FederatedPointerEvent, log2 } from 'pixi.js'
import type { IBaseSceneParams } from '@SceneCore/types/hooks'
import { useGlobalToLocal } from '@/components/SceneCore/hooks/index'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/mouse'
import emitter, { E_EVENT_SCENE } from '@SceneCore/mitt/mitt'
import { addSelectedComponent } from '@/components/SceneCore/utils/index'
export default class SelectArea {
  props: IBaseSceneParams['props']
  app: IBaseSceneParams['app']
  root: IBaseSceneParams['root']
  userData: IBaseSceneParams['userData']
  /*  */
  node = new Graphics()
  startPoint = { x: 0, y: 0 }
  startGlobalPoint = { x: 0, y: 0 }
  endPoint = { x: 0, y: 0 }
  endGlobalPoint = { x: 0, y: 0 }
  isMouseDown = false
  color = 0x67c23a
  gap = 10

  constructor({ app, root, props, userData }: IBaseSceneParams) {
    this.app = app
    this.root = root
    this.props = props
    this.userData = userData
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
    this.startGlobalPoint = e.global.clone()
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
      this.endGlobalPoint = e.global.clone()
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
    const startGlobalPoint = {
      x: Math.min(this.startGlobalPoint.x, this.endGlobalPoint.x),
      y: Math.min(this.startGlobalPoint.y, this.endGlobalPoint.y),
    }

    const endGlobalPoint = {
      x: Math.max(this.startGlobalPoint.x, this.endGlobalPoint.x),
      y: Math.max(this.startGlobalPoint.y, this.endGlobalPoint.y),
    }
    return { width, height, startPoint, endPoint, startGlobalPoint, endGlobalPoint }
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
    /* TODO */
    const nodeList = this.userData.nodeList
    const keys = Array.from(nodeList.keys())

    for (let index = 0; index < keys.length; index++) {
      const key = keys[index]
      const node = nodeList.get(key)
      if (this.detectIntersection(node!, data)) {
        // addSelectedComponent(this.props,t)
        // this.props.selectedComponent.push({ id: key, label: node!.label })
        // this.userData.selectedNodes.value.push(node!)
      }
    }
  }

  getNodeRect(node: Container) {
    const { x, y, width, height } = node.getBounds()
    return { x, y, width, height }
  }

  detectIntersection(node: Container, data: ReturnType<typeof this.getArea>): Boolean {
    const nodeRect = this.getNodeRect(node)
    const rect1 = new Rectangle(nodeRect.x, nodeRect.y, nodeRect.width, nodeRect.height)
    const rect2 = new Rectangle(
      data.startGlobalPoint.x,
      data.startGlobalPoint.y,
      data.width,
      data.height,
    )

    if (rect1.intersects(rect2)) {
      return true
    }
    return false
  }
}
