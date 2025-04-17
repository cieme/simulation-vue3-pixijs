import { inject } from 'vue'
import { Container } from 'pixi.js'
import type { ICreateNodeParams, IGlobalToLocalParams } from '@/components/SceneCore/types/hooks'

/**
 * 使用 app, assets, root, userData 四个 inject 注入
 * @export
 * @returns {{ app: Application; assets: any; root: Container; userData: ICreateNodeParams["userData"]; }}
 */
export function useApp() {
  const userData = inject<ICreateNodeParams['userData']>('userData')
  return {
    userData: userData as ICreateNodeParams['userData'],
  }
}

/**
 * @description 世界坐标转为 局部坐标
 *
 * @export
 * @param {IGlobalToLocalParams} param0
 * @param {IGlobalToLocalParams} param0.globalPoint
 * @param {IGlobalToLocalParams} param0.node
 * @param {IGlobalToLocalParams} param0.point
 * @param {IGlobalToLocalParams} param0.app
 * @returns {{ localPoint: any; appPoint: { x: number; y: number; }; }}
 */
export function useGlobalToLocal({ globalPoint, node, point, app, root }: IGlobalToLocalParams) {
  node.toLocal(globalPoint, app.stage, point)
  point.x = point.x - (app.renderer.canvas.width * (1 / root.scale.x)) / 2
  point.y = point.y - (app.renderer.canvas.height * (1 / root.scale.x)) / 2
  return {
    point,
    globalPoint,
  }
}

/**
 * @description AABB 矩形碰撞检测
 * @export
 * @param {Container} spriteA
 * @param {Container} spriteB
 * @returns {boolean}
 */
export function isColliding(spriteA: Container, spriteB: Container) {
  const boundsA = spriteA.getBounds()
  const boundsB = spriteB.getBounds()
  return (
    boundsA.x < boundsB.x + boundsB.width &&
    boundsA.x + boundsA.width > boundsB.x &&
    boundsA.y < boundsB.y + boundsB.height &&
    boundsA.y + boundsA.height > boundsB.y
  )
}
