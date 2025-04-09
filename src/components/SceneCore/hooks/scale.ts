import { Container, Application, type PointData } from 'pixi.js'
import type { FederatedWheelEvent } from 'pixi.js'
import Big from 'big.js'
export function useScale({
  targetNode,
  app,
  scale,
  refScale,
}: {
  targetNode: Container
  app: Application
  scale?: number
  refScale: PointData
}) {
  if (scale) {
    targetNode.scale.set(scale, scale)
  }
  refScale = targetNode.scale
  const minScale = 0.5
  const maxScale = 5
  // 根据鼠标位置,缩放
  const onWheel = (e: FederatedWheelEvent) => {
    const currentScale = new Big(refScale.x)

    const beforeNodeScaleX = refScale.x
    let afterNodeScaleX = beforeNodeScaleX
    /* 需要计算变化之后位置 */
    let delta = 0.1
    if (e.deltaY > 0) {
      delta = -delta
    }
    const newScale = currentScale.plus(delta)
    if (newScale.gte(minScale) && newScale.lte(maxScale)) {
      afterNodeScaleX = newScale.toNumber()
      /*  */
      calcPosition(e, beforeNodeScaleX, afterNodeScaleX, targetNode)
      refScale.x = afterNodeScaleX
      refScale.y = afterNodeScaleX
      // targetNode.scale = refScale
    }
  }

  targetNode.interactive = true
  function addEvent() {
    app.stage.on('wheel', onWheel)
  }
  function removeEvent() {
    app?.stage?.off('wheel', onWheel)
  }
  const dispose = () => {
    removeEvent()
  }
  const resetScale = () => {
    refScale.x = 1
    refScale.y = 1
    targetNode.scale.set(1, 1)
    targetNode.position.set(0, 0)
  }
  return {
    refScale,
    minScale,
    maxScale,
    addEvent,
    removeEvent,
    dispose,
    resetScale,
  }
}
function calcPosition(
  e: FederatedWheelEvent,
  beforeNodeScaleX: number,
  afterNodeScaleX: number,
  targetNode: Container,
) {
  /* 实际原点坐标 */
  const mousePosition2 = e.getLocalPosition(targetNode.parent, e.global.clone())

  /* 关键行1 */
  const uiTouchPos = {
    x: mousePosition2.x - targetNode.position.x,
    y: mousePosition2.y - targetNode.position.y,
  }

  const divPosX = uiTouchPos.x / beforeNodeScaleX
  const divPoxY = uiTouchPos.y / beforeNodeScaleX
  /* 2 */
  const mulX = divPosX * afterNodeScaleX
  const mulY = divPoxY * afterNodeScaleX

  const newPos = {
    x: mousePosition2.x - mulX,
    y: mousePosition2.y - mulY,
  }

  targetNode.scale.set(afterNodeScaleX, afterNodeScaleX)
  targetNode.position.set(newPos.x, newPos.y)
}
