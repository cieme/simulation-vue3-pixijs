import { Container, Graphics, type PointData } from 'pixi.js'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/ENUM_MOUSE'
import type { IBaseSceneParams } from '@/components/SceneCore/types/hooks'
import emitter, { E_EVENT_SCENE } from '../mitt/mitt'
export default class LinkPoint {
  app: IBaseSceneParams['app']
  userData: IBaseSceneParams['userData']
  node: Graphics = new Graphics()
  parentNode: Container
  position: PointData
  linkID: string
  disposeMove: ReturnType<typeof useDragComponentHook>['dispose']
  constructor({
    parentNode,
    app,
    userData,
    position,
    linkID
  }: {
    parentNode: Container
    app: IBaseSceneParams['app']
    userData: IBaseSceneParams['userData']
    position: PointData
    linkID: string
  }) {
    this.app = app
    this.userData = userData
    this.node.pivot.set(5, 5)
    this.node.interactive = true
    this.node.cursor = 'pointer'
    this.position = position
    this.node.position = this.position
    this.linkID = linkID
    const { dispose } = useDragComponentHook({
      eventNode: this.node,
      app: this.app,
      userData: this.userData,
      buttons: [E_MOUSE_BUTTON.LEFT],
      downHandler: (e) => {
        e.stopPropagation()
      },
      moveHandler: ({ scaleX, scaleY }) => {
        this.position.x += scaleX
        this.position.y += scaleY
        this.node.position = this.position
        /* 为了重绘连接线 */
        emitter.emit(E_EVENT_SCENE.MOVE_LINK, this.linkID)
      },
    })

    this.disposeMove = dispose
    /*  */
    this.parentNode = parentNode
    this.parentNode.addChild(this.node)
    /*  */
    this.init()
  }
  init() {
    /* 绘制一个 8*8 的红色矩形 */
    this.node.rect(0, 0, 10, 10)
    this.node.fill({
      color: 0x356ff4,
    })
  }
  dispose() {
    this.disposeMove()
    this.node.destroy({
      children: true,
      texture: true,
      // textureSource: true,
      context: true,
      style: true,
    })
  }
}
