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

  constructor({ app, root, props, userData }: IBaseSceneParams) {
    this.app = app
    this.root = root
    this.props = props
    this.userData = userData
    this.node.label = 'LinkManager'
    this.node.addChild(this.graphics)
    this.onEmit()
    this.node.on('destroyed', this.dispose)
  }
  dispose() {
    this.unEmit()
  }
  onLinkSuccess = (status: ENUM_LINK_TYPE) => {
    if (status === ENUM_LINK_TYPE.LINK_SUCCESS) {
      this.convert()
      this.draw()
    }
  }
  onEmit() {
    emitter.on(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
  }
  unEmit() {
    emitter.off(E_EVENT_SCENE.LINK_STATUS, this.onLinkSuccess)
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
    this.graphics.stroke({
      width: 4,
      color: 0xff0000,
      join: 'round',
      cap: 'round',
    })
  }
}
