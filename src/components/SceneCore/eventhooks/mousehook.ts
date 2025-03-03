import { Application, Container, type FederatedPointerEvent, Point } from 'pixi.js'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
export interface IDragComponentHookParams {
  eventNode: Container
  userData: ICreateNodeParams['userData']
  rootNode: Container
  app: Application
}
export function useDragComponentHook(params: IDragComponentHookParams) {
  const { eventNode, rootNode, app, userData } = params
  const { getDelta, resetMouseMove } = useMouseMoveDelta()
  const mouseMoveHandler = (event: FederatedPointerEvent) => {
    const currentMousePosition = event.global
    const { deltaX, deltaY } = getDelta(currentMousePosition)
    userData.nodeList.forEach((targetNode) => {
      const position = targetNode.position
      targetNode.position.x = position.x + deltaX
      targetNode.position.y = position.y + deltaY
    })
  }

  const mouseDownHandler = (event: FederatedPointerEvent) => {
    event.stopPropagation()
    app.stage.on('pointermove', mouseMoveHandler)
  }
  const mouseUpHandler = (event: FederatedPointerEvent) => {
    event.stopPropagation()
    app.stage.off('pointermove', mouseMoveHandler)
    resetMouseMove()
  }

  eventNode.on('mousedown', mouseDownHandler)
  app.stage.on('mouseup', mouseUpHandler)

  const dispose = () => {
    app.stage.off('mousemove', mouseMoveHandler)
    eventNode.off('mousedown', mouseDownHandler)
    app.stage.off('mouseup', mouseUpHandler)
  }

  return {
    dispose,
    mouseMoveHandler,
    mouseDownHandler,
    mouseUpHandler,
  }
}

export function useMouseMoveDelta() {
  let MoveIndex = 0
  let lastMousePosition = { x: 0, y: 0 } // 用来存储上一次的鼠标位置
  const getDelta = (currentMousePosition: Point) => {
    if (MoveIndex === 0) {
      lastMousePosition.x = currentMousePosition.x
      lastMousePosition.y = currentMousePosition.y
    }
    const deltaX = currentMousePosition.x - lastMousePosition.x
    const deltaY = currentMousePosition.y - lastMousePosition.y
    lastMousePosition.x = currentMousePosition.x
    lastMousePosition.y = currentMousePosition.y
    MoveIndex++
    return {
      deltaX,
      deltaY,
    }
  }
  const resetMouseMove = () => {
    MoveIndex = 0
    lastMousePosition.x = 0
    lastMousePosition.y = 0
  }
  return {
    resetMouseMove,
    getDelta,
  }
}
