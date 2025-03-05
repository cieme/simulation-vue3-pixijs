import { inject } from 'vue'
import { Application, Container } from 'pixi.js'
import type { ICreateNodeParams, IGlobalToLocalParams } from '@/components/SceneCore/types/hooks'

/**
 * 使用 app, assets, root, userData 四个 inject 注入
 * @export
 * @returns {{ app: Application; assets: any; root: Container; userData: ICreateNodeParams["userData"]; }}
 */
export function useApp() {
  const app = inject<ICreateNodeParams['app']>('app')
  const assets = inject<ICreateNodeParams['assets']>('assets')
  const root = inject<ICreateNodeParams['root']>('root')
  const userData = inject<ICreateNodeParams['userData']>('userData')
  return {
    app: app as Application,
    assets,
    root: root as Container,
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
export function useGlobalToLocal({ globalPoint, node, point, app }: IGlobalToLocalParams) {
  const localPoint = node.toLocal(globalPoint, node, point)
  const appPoint = {
    x: localPoint.x - app.renderer.canvas.width / 2,
    y: localPoint.y - app.renderer.canvas.height / 2,
  }
  return {
    localPoint,
    appPoint,
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
