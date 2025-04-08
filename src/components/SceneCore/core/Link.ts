import { Graphics, Container, Polygon, type PointData } from 'pixi.js'
import emitter, { E_EVENT_SCENE, ENUM_LINK_TYPE } from '@/components/SceneCore/mitt/mitt'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
export default class LinkManager {
  props: IBaseSceneParams['props']
  app: IBaseSceneParams['app']
  root: IBaseSceneParams['root']
  userData: IBaseSceneParams['userData']
  /*  */
  node = new Container()
  graphics = new Graphics()
  PolygonList: Array<{ id: string; polygon: Polygon }> = []
  drawSuccessLink = [ENUM_LINK_TYPE.LINK_SUCCESS, ENUM_LINK_TYPE.LINK_CANCEL]
  constructor({ app, root, props, userData }: IBaseSceneParams) {
    this.app = app
    this.root = root
    this.props = props
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
      this.convert()
      this.draw()
    } else if (status === ENUM_LINK_TYPE.LINK_ING) {
      this.convert()
      this.draw()
      this.drawing()
    }
  }
  onMoveComponent = () => {
    this.convert()
    this.draw()
  }
  onEmit() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.on(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
  }
  unEmit() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
    emitter.off(E_EVENT_SCENE.MOVE_COMPONENT, this.onMoveComponent)
  }
  init() {
    this.node.position.set(this.app.screen.width / 2, this.app.screen.height / 2)
  }
  convert() {
    this.PolygonList = []
    this.userData.linkReactive.LinkData.forEach((item) => {
      const points: PointData[] = []

      const startNode = this.userData.nodeList.get(item.start)?.nextLinkNode
      const startLocalPosition = startNode?.getGlobalPosition()
      if (startLocalPosition) {
        const startPosition = this.node?.toLocal(startLocalPosition).clone()

        if (startPosition) {
          points.push(startPosition)
        }
      }
      const linkingPoints = item.point.map((item) => {
        return this.node?.toLocal(item)
      })
      points.push(...linkingPoints)
      if (item.end) {
        const endNode = this.userData.nodeList.get(item.end)?.prevLinkNode
        const endLocalPosition = endNode?.getGlobalPosition()
        if (endLocalPosition) {
          const endPosition = this.node?.toLocal(endLocalPosition).clone()

          if (endPosition) {
            points.push(endPosition)
          }
        }
      }

      const polygon = new Polygon(points)
      this.PolygonList.push({ id: item.uniqueId, polygon })
    })
  }
  draw() {
    this.graphics.clear()
    this.PolygonList.forEach((item) => {
      this.graphics.poly(item.polygon.points, false)
    })
    this.stroke()
  }
  stroke() {
    this.graphics.stroke({
      width: 4,
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
        const startPosition = this.node?.toLocal(startLocalPosition).clone()
        if (startPosition) {
          points.push(startPosition)
        }
      }
      const linkingPoints = this.userData.linkReactive.linking.point.map((item) => {
        return this.node?.toLocal(item)
      })
      points.push(...linkingPoints)
      if (this.userData.linkReactive.linking.linking) {
        points.push(this.node?.toLocal(this.userData.linkReactive.linking.linking))
      }
    }
    const numberPoints = this.PointDataToNumber(points)

    this.graphics.poly(numberPoints, false)
    this.stroke()
  }
  PointDataToNumber(point: PointData[]): number[] {
    return point
      .map((item) => {
        return [item.x, item.y]
      })
      .flat(1)
  }
}
