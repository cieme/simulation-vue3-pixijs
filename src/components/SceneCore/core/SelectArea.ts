import { computed } from 'vue'
import { Rectangle, Graphics, Container, Point, FederatedPointerEvent } from 'pixi.js'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import { useGlobalToLocal } from '@/components/SceneCore/hooks/index'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/ENUM_MOUSE'
import emitter, { E_EVENT_SCENE, ENUM_TOOL } from '@/components/SceneCore/mitt/mitt'
import {
  useSelectedComponent,
  replaceSelectedComponentList,
} from '@/components/SceneCore/utils/index'
import { throttleForResize } from '@/utils/index'

export default class SelectArea {
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
  selectedComponentMapInstance = useSelectedComponent()
  eventNode: Container
  alignConfigMap: Map<string, (typeof this.userData.Ref_configList.value)[number]> = new Map()
  computedUserConfigObject = computed(() => {
    this.alignConfigMap.clear()
    for (let i = 0; i < this.userData.Ref_configList.value.length; i++) {
      const item = this.userData.Ref_configList.value[i]
      this.alignConfigMap.set(item.id, item)
    }
    return this.alignConfigMap
  })
  constructor({ userData }: IBaseSceneParams) {
    this.eventNode = userData.app.stage

    this.userData = userData
    this.node.label = 'SelectArea'
  }

  init() {
    this.initStyle()
    this.addEvent()
    this.addLifeEvent()
  }
  addLifeEvent() {
    emitter.on(E_EVENT_SCENE.SCENE_OPERATION_STATUS, (status) => {
      if (status !== ENUM_TOOL.SELECT) {
        this.removeEvent()
      } else {
        this.addEvent()
      }
    })
  }
  initStyle() {
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
    this.eventNode.on('mousedown', this.onMouseDown, this)
    this.eventNode.on('mouseup', this.onMouseUp, this)
    this.eventNode.on('mouseupoutside', this.onMouseUp, this)
  }

  removeEvent() {
    this.eventNode.off('mousedown', this.onMouseDown, this)
    this.eventNode.off('mouseup', this.onMouseUp, this)
    this.eventNode.off('mouseupoutside', this.onMouseUp, this)
    /*  */
    this.eventNode.off('mousemove', this.onMouseMove, this)
  }

  onMouseDown(e: FederatedPointerEvent) {
    if (e.button !== E_MOUSE_BUTTON.LEFT) return
    this.isMouseDown = true
    useGlobalToLocal({
      globalPoint: e.global,
      node: this.node,
      app: this.userData.app,
      root: this.userData.root,
      point: this.startPoint,
    })

    this.startGlobalPoint = e.global.clone()
    this.eventNode.on('mousemove', this.onMouseMove, this)
  }

  onMouseMove = throttleForResize<FederatedPointerEvent>((e: FederatedPointerEvent) => {
    if (this.isMouseDown) {
      useGlobalToLocal({
        globalPoint: e.global,
        node: this.node,
        app: this.userData.app,
        root: this.userData.root,
        point: this.endPoint,
      })

      this.endGlobalPoint = e.global.clone()
      const data = this.getArea()
      if (data.width < this.gap && data.height < this.gap) return
      this.drawArea(data)
    }
  })

  onMouseUp(e: FederatedPointerEvent) {
    this.isMouseDown = false
    this.eventNode.off('mousemove', this.onMouseMove, this)
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
    emitter.emit(E_EVENT_SCENE.BOX_SELECTION, data)
  }

  checkoutArea(data: ReturnType<typeof this.getArea>) {
    /* TODO */
    const nodeMap = this.userData.M_nodeList
    const Ref_configList = this.userData.Ref_configList.value
    // const keys = Array.from(M_nodeList.keys())
    this.selectedComponentMapInstance.clear()

    for (const item of nodeMap) {
      const node = item[1].iconNode
      if (!node) continue
      if (this.detectIntersection(node, data)) {
        const config: (typeof Ref_configList)[number] | undefined =
          this.computedUserConfigObject.value.get(item[0])

        if (config) {
          this.selectedComponentMapInstance.add(config)
        }
      }
    }
    this.updateSelectedComponent()
  }

  updateSelectedComponent = throttleForResize<void>(() => {
    replaceSelectedComponentList(
      this.userData.Ref_selectedComponent,
      this.selectedComponentMapInstance.getValues(),
    )
  })
  hasIcon(node: Container) {
    return node.getChildByName('icon')
  }
  getNodeRect(node: Container) {
    const icon = this.hasIcon(node)
    if (icon) {
      return icon.getBounds()
    }
    return node.getBounds()
  }

  detectIntersection(node: Container, data: ReturnType<typeof this.getArea>): Boolean {
    const nodeRect = this.getNodeRect(node)
    const rect1 = new Rectangle(nodeRect.x, nodeRect.y, nodeRect.width, nodeRect.height)
    const rect2 = new Rectangle(
      data.startGlobalPoint.x,
      data.startGlobalPoint.y,
      data.width * this.userData.root.scale.x,
      data.height * this.userData.root.scale.x,
    )

    if (rect1.intersects(rect2)) {
      return true
    }
    return false
  }
}
