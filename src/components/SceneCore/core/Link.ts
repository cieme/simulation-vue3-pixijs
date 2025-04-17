import {
  Graphics,
  Container,
  Polygon,
  type PointData,
  Assets,
  Texture,
  FederatedPointerEvent,
} from 'pixi.js'
import { Vector2 } from 'three'
import emitter, { E_EVENT_SCENE, ENUM_LINK_TYPE } from '@/components/SceneCore/mitt/mitt'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import { E_MOUSE_BUTTON } from '../enum/ENUM_MOUSE'
import LinkPoint from './LinkPoint'
import { useCreateLabelNode, useCreateLabelText } from '@/components/SceneCore/hooks/createText'
export default class LinkManager {

  userData: IBaseSceneParams['userData']

  /*  */
  node = new Container()
  graphics = new Graphics()
  PolygonList: Array<{ id: string; polygon: Polygon }> = []
  labelNodeList: Array<{ id: string; start: Container; end: Container }> = []
  drawSuccessLink = [ENUM_LINK_TYPE.LINK_SUCCESS, ENUM_LINK_TYPE.LINK_CANCEL]
  /*  */
  labelLength = 32

  pointList: LinkPoint[] = []
  constructor({  userData }: IBaseSceneParams) {


    this.userData = userData

    this.node.label = 'LinkManager'
    this.node.addChild(this.graphics)
    this.onEmit()
    this.node.on('destroyed', this.dispose, this)
  }
  dispose() {
    // this.graphics.destroy()
    // this.labelNodeList.forEach((item) => {
    //   item.start.destroy()
    //   item.end.destroy()
    // })
    this.pointList.forEach((item) => {
      item.dispose()
    })
    this.unEmit()
    /*  */
    this.node.destroy({
      children: true,
      context: true,
    })
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
  onMoveComponent = (componentIdArray: string[]) => {
    this.render()
    const linkArray = this.getLinkArrayByComponentIdArray(componentIdArray)
    linkArray.forEach((item) => {
      this.updateLinkPositionById(item.uniqueId)
    })
  }
  onMoveLink = (linkId: string) => {
    this.render()
    this.updateLinkPositionById(linkId)
  }

  onSceneMouseDown = (e: FederatedPointerEvent) => {
    /* 如果之前有选中线 */
    this.clearPointAndClearCurrentLink()
  }
  onEmit() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.on(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
    emitter.on(E_EVENT_SCENE.MOVE_LINK, this.onMoveLink)
    emitter.on(E_EVENT_SCENE.MOUSE_DOWN_SCENE, this.onSceneMouseDown)
  }
  unEmit() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.off(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
    emitter.off(E_EVENT_SCENE.MOVE_LINK, this.onMoveLink)
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
            userData: this.userData,
            position: link.point[index],
            linkID: link.uniqueId,
          })
          this.pointList.push(point)
        }
      })
    }
  }
  /*  */
  deleteLink(id: string) {
    for (let index = 0; index < this.userData.linkReactive.LinkData.length; index++) {
      const item = this.userData.linkReactive.LinkData[index]
      if (item.uniqueId === id) {
        this.userData.linkReactive.LinkData.splice(index, 1)
        const { linkLabelNode, index: i } = this.getLinkLabelNodeById(id)
        if (linkLabelNode) {
          linkLabelNode.start.destroy()
          linkLabelNode.end.destroy()
          this.labelNodeList.splice(i, 1)
        }
        break
      }
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
  genAllLabelNodes() {
    for (let index = 0; index < this.PolygonList.length; index++) {
      const startTextNode = this.genNewLabelNode()
      const endTextNode = this.genNewLabelNode()
      this.updateLabelNodePosition(startTextNode, endTextNode, this.PolygonList[index])
      /*  */
      this.labelNodeList.push({
        id: this.PolygonList[index].id,
        start: startTextNode,
        end: endTextNode,
      })
      this.node.addChild(startTextNode)
      this.node.addChild(endTextNode)
      const startTexture = useCreateLabelText('1', this.userData.assets)
      const endTexture = useCreateLabelText('2', this.userData.assets)
      if (startTexture) {
        startTextNode.texture = startTexture
      }
      if (endTexture) {
        endTextNode.texture = endTexture
      }
    }
  }
  genNewLabelNode() {
    const textNode = useCreateLabelNode()
    textNode.anchor.x = 0.5
    textNode.anchor.y = 0.5
    return textNode
  }
  /**
   * 更新某根连接线的label位置信息
   *
   * @param {Container} startTextNode
   * @param {Container} endTextNode
   * @param {(typeof this.PolygonList)[number]} item
   */
  updateLabelNodePosition(
    startTextNode: Container,
    endTextNode: Container,
    item: (typeof this.PolygonList)[number],
  ) {
    const startPoint = new Vector2(item.polygon.points[0], item.polygon.points[1])
    const nextPoint = new Vector2(item.polygon.points[2], item.polygon.points[3])
    /*  */
    const prevPoint = new Vector2(
      item.polygon.points[item.polygon.points.length - 4],
      item.polygon.points[item.polygon.points.length - 3],
    )
    const endPoint = new Vector2(
      item.polygon.points[item.polygon.points.length - 2],
      item.polygon.points[item.polygon.points.length - 1],
    )

    /* 开始点 */
    const direction = new Vector2().subVectors(nextPoint, startPoint).normalize() // 得到方向向量（单位长度）
    const startTextNodePosition = new Vector2().addVectors(
      startPoint,
      direction.multiplyScalar(this.labelLength),
    )
    /* 结束点 */
    const endDirection = new Vector2().subVectors(prevPoint, endPoint).normalize() // 得到方向向量（单位长度）
    const endTextNodePosition = new Vector2().addVectors(
      endPoint,
      endDirection.multiplyScalar(this.labelLength),
    )
    /*  */
    startTextNode.position.set(startTextNodePosition.x, startTextNodePosition.y)
    endTextNode.position.set(endTextNodePosition.x, endTextNodePosition.y)
  }
  updateLinkPositionById(linkId: string) {
    const { linkLabelNode } = this.getLinkLabelNodeById(linkId)
    if (linkLabelNode) {
      const polygon = this.getPolygonById(linkId)
      if (polygon) {
        this.updateLabelNodePosition(linkLabelNode.start, linkLabelNode.end, polygon)
      }
    }
  }
  getPolygonById(linkId: string) {
    let polygon = undefined
    for (let index = 0; index < this.PolygonList.length; index++) {
      const item = this.PolygonList[index]
      if (item.id === linkId) {
        polygon = item
        break
      }
    }
    return polygon
  }

  /* 获取移动中的组件 */
  getLinkLabelNodeById(linkId: string) {
    let linkLabelNode: (typeof this.labelNodeList)[number] | undefined = undefined
    let index = -1
    for (let i = 0; i < this.labelNodeList.length; i++) {
      const labelItem = this.labelNodeList[i]
      if (labelItem.id === linkId) {
        linkLabelNode = labelItem
        index = i
        break
      }
    }
    return {
      linkLabelNode,
      index,
    }
  }
  getLinkArrayByComponentIdArray(componentIdArray: string[]) {
    const linkArray = this.userData.linkReactive.LinkData.filter((item) => {
      if (!item.end) {
        return componentIdArray.includes(item.start)
      }
      return componentIdArray.includes(item.start) || componentIdArray.includes(item.end)
    })
    return linkArray
  }
}
