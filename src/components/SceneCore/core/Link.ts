import {
  Graphics,
  Container,
  Polygon,
  type PointData,
  Assets,
  Texture,
  FederatedPointerEvent,
} from 'pixi.js'
import emitter, { E_EVENT_SCENE, ENUM_LINK_TYPE } from '@/components/SceneCore/mitt/mitt'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import { E_MOUSE_BUTTON } from '../enum/ENUM_MOUSE'
import LinkPoint from './LinkPoint'

export default class LinkManager {
  app: IBaseSceneParams['app']
  root: IBaseSceneParams['root']
  userData: IBaseSceneParams['userData']
  /*  */
  node = new Container()
  graphics = new Graphics()
  PolygonList: Array<{ id: string; polygon: Polygon }> = []
  drawSuccessLink = [ENUM_LINK_TYPE.LINK_SUCCESS, ENUM_LINK_TYPE.LINK_CANCEL]

  pointList: LinkPoint[] = []
  constructor({ app, root, userData }: IBaseSceneParams) {
    this.app = app
    this.root = root
    this.userData = userData
    this.node.label = 'LinkManager'
    this.node.addChild(this.graphics)
    this.onEmit()
    this.node.on('destroyed', this.dispose, this)
  }
  dispose() {
    this.unEmit()
  }
  onLinkSuccess = (status: ENUM_LINK_TYPE) => {
    if (this.drawSuccessLink.includes(status)) {
      this.render()
    } else if (status === ENUM_LINK_TYPE.LINK_ING) {
      this.render()
      this.drawing()
    }
  }
  render() {
    this.convert()
    this.draw()
  }
  onMoveComponent = () => {
    this.convert()
    this.draw()
  }
  onSceneMouseDown = (e: FederatedPointerEvent) => {
    /* 如果之前有选中线 */
    this.clearPointAndClearCurrentLink()
  }
  onEmit() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.on(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
    emitter.on(E_EVENT_SCENE.MOUSE_DOWN_SCENE, this.onSceneMouseDown)
  }
  unEmit() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.off(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
    emitter.off(E_EVENT_SCENE.MOUSE_DOWN_SCENE, this.onSceneMouseDown)
  }
  selectLink = (e: FederatedPointerEvent) => {
    if (this.userData.linkReactive.linking) return
    if (e.button !== E_MOUSE_BUTTON.LEFT) return
    e.stopPropagation()
    // e.stopPropagation() // 不加这行会自动 清除选择的组件,如果增加，因为面板互斥,需要手动清除，暂时自动清除
    const point = this.toLocal(e.global.clone())
    const polygonOne = this.PolygonList.find((item) => {
      const hit = item.polygon.strokeContains(point.x, point.y, 3)
      return hit
    })

    if (!polygonOne || !this.userData?.linkReactive) return
    const link = this.userData.linkReactive.LinkData.find((item) => item.uniqueId === polygonOne.id)

    if (link) {
      this.userData.selectedComponent.value.length = 0
      /* 这行有用，如果没选组件，也要清除一次 */
      this.clearPointAndClearCurrentLink()
      /* 这微任务是因为 scene watch 了 组件数量 */
      Promise.resolve().then(() => {
        this.userData.currentLink = link
        for (let index = 0; index < link.point.length; index++) {
          const point = new LinkPoint({
            parentNode: this.node,
            app: this.app,
            userData: this.userData,
            position: link.point[index],
          })
          this.pointList.push(point)
        }
      })
    }
  }
  /**
   * 清空当前选择线
   * 销毁拐点
   */
  clearPointAndClearCurrentLink() {
    this.userData.currentLink = null
    for (let index = 0; index < this.pointList.length; index++) {
      const point = this.pointList[index]
      point.dispose()
      this.pointList.splice(index, 1)
      index--
    }
  }
  addEvent() {
    this.graphics.interactive = true
    this.graphics.cursor = 'pointer'
    this.graphics.on('mousedown', this.selectLink)
  }
  removeEvent() {
    this.graphics.interactive = false
    this.graphics.cursor = 'default'
    this.graphics.off('mousedown', this.selectLink)
  }
  init() {
    this.addEvent()
  }
  convert() {
    this.PolygonList = []
    this.userData.linkReactive.LinkData.forEach((item) => {
      const points: PointData[] = []

      const startNode = this.userData.nodeList.get(item.start)?.nextLinkNode
      const startLocalPosition = startNode?.getGlobalPosition()
      if (startLocalPosition) {
        const startPosition = this.toLocal(startLocalPosition)

        if (startPosition) {
          points.push(startPosition)
        }
      }
      const linkingPoints = item.point.map((item) => {
        return item
      })
      points.push(...linkingPoints)
      if (item.end) {
        const endNode = this.userData.nodeList.get(item.end)?.prevLinkNode
        const endLocalPosition = endNode?.getGlobalPosition()
        if (endLocalPosition) {
          const endPosition = this.toLocal(endLocalPosition)

          if (endPosition) {
            points.push(endPosition)
          }
        }
      }

      const polygon = new Polygon(points)
      this.PolygonList.push({ id: item.uniqueId, polygon })
    })
  }
  toLocal(position: PointData) {
    return this.node.toLocal(position)
  }
  draw() {
    this.graphics.clear()
    this.PolygonList.forEach((item) => {
      this.graphics.poly(item.polygon.points, false)
      this.fillArrows(item.polygon.points)
    })
    this.stroke()
  }
  async stroke() {
    this.graphics.stroke({
      width: 3,
      color: 0x356ff4,
      join: 'round',
      cap: 'round',
    })
  }
  drawing() {
    const points: PointData[] = []
    if (this.userData.linkReactive.linking) {
      const startNode = this.userData.nodeList.get(
        this.userData.linkReactive.linking.start,
      )?.nextLinkNode
      const startLocalPosition = startNode?.getGlobalPosition()
      if (startLocalPosition) {
        const startPosition = this.toLocal(startLocalPosition)
        if (startPosition) {
          points.push(startPosition)
        }
      }
      const linkingPoints = this.userData.linkReactive.linking.point.map((item) => {
        return item
      })
      points.push(...linkingPoints)
      if (this.userData.linkReactive.linking.linking) {
        points.push(this.toLocal(this.userData.linkReactive.linking.linking))
      }
    }
    const numberPoints = this.PointDataToNumber(points)

    this.graphics.poly(numberPoints, false)
    this.fillArrows(numberPoints)
    this.stroke()
  }
  PointDataToNumber(point: PointData[]): number[] {
    return point
      .map((item) => {
        return [item.x, item.y]
      })
      .flat(1)
  }

  fillArrows(point: number[]) {
    if (point.length > 3) {
      for (let index = 0; index < point.length - 2; index += 2) {
        const item: PointData = { x: point[index], y: point[index + 1] }
        const nextPoint: PointData = { x: point[index + 2], y: point[index + 3] }
        const [left, tip, right] = this.getArrowTrianglePoints(item, nextPoint)
        this.graphics.moveTo(left.x, left.y)
        this.graphics.lineTo(tip.x, tip.y)
        this.graphics.lineTo(right.x, right.y)
      }
    }
  }
  getDistance(startPoint: PointData, endPoint: PointData) {
    const dx = endPoint.x - startPoint.x
    const dy = endPoint.y - startPoint.y
    return Math.sqrt(dx * dx + dy * dy)
  }
  getArrowTrianglePoints(p1: PointData, p2: PointData, width = 10, height = 10) {
    // 中点坐标
    const midX = (p1.x + p2.x) / 2
    const midY = (p1.y + p2.y) / 2

    // 方向向量 (dx, dy)
    const dx = p2.x - p1.x
    const dy = p2.y - p1.y
    const len = Math.sqrt(dx * dx + dy * dy)
    const nx = dx / len
    const ny = dy / len

    // 垂直方向向量（左法向）
    const perpX = -ny
    const perpY = nx

    // 箭头三个点
    const tip = {
      x: midX + nx * (height / 2),
      y: midY + ny * (height / 2),
    }
    const left = {
      x: midX + perpX * (width / 2),
      y: midY + perpY * (width / 2),
    }
    const right = {
      x: midX - perpX * (width / 2),
      y: midY - perpY * (width / 2),
    }

    return [left, tip, right]
  }
}
