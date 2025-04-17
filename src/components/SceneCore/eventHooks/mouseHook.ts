import { Application, Container, type FederatedPointerEvent, Point } from 'pixi.js'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import { E_MOUSE_BUTTON } from '@/components/SceneCore/enum/ENUM_MOUSE'
export interface IDragComponentHookParams {
  eventNode: Container
  userData: ICreateNodeParams['userData']
  app: Application
  moveHandler: (params: {
    deltaX: number
    deltaY: number
    event: FederatedPointerEvent
    scaleX: number
    scaleY: number
  }) => void
  downHandler?: (event: FederatedPointerEvent) => void
  buttons: Array<E_MOUSE_BUTTON>
}

/**
 * 使用拖拽节点
 *
 * @export
 * @param {IDragComponentHookParams} params
 * @returns {{ dispose: () => void; mouseMoveHandler: (event: FederatedPointerEvent) => void; mouseDownHandler: (event: FederatedPointerEvent) => void; mouseUpHandler: (event: FederatedPointerEvent) => void; }}
 */
export function useDragComponentHook(params: IDragComponentHookParams) {
  const { eventNode, app, userData, moveHandler,downHandler } = params
  const { getDelta, resetMouseMove } = useMouseMoveDelta()

  const mouseMoveHandler = (event: FederatedPointerEvent) => {
    const currentMousePosition = event.global
    const { deltaX, deltaY } = getDelta(currentMousePosition)
    /*  */
    const scaleX = deltaX / userData.Ref_scale.value.x
    const scaleY = deltaY / userData.Ref_scale.value.y
    moveHandler({
      deltaX,
      deltaY,
      event,
      scaleX,
      scaleY,
    })
  }

  const mouseDownHandler = (event: FederatedPointerEvent) => {
    if (!params.buttons.includes(event.button)) return
    if(downHandler){
      downHandler(event)
    }
    app.stage.on('mousemove', mouseMoveHandler)
  }
  const mouseUpHandler = (event: FederatedPointerEvent) => {
    app.stage?.off('mousemove', mouseMoveHandler)
    resetMouseMove()
  }

  eventNode.on('mousedown', mouseDownHandler)
  app.stage?.on('mouseup', mouseUpHandler)
  app.stage?.on('mouseupoutside', mouseUpHandler)

  const dispose = () => {
    eventNode?.off('mousedown', mouseDownHandler)
    app.stage?.off('mouseup', mouseUpHandler)
    app.stage?.off('mousemove', mouseMoveHandler)
    app.stage?.off('mouseupoutside', mouseUpHandler)
  }

  return {
    dispose,
    mouseMoveHandler,
    mouseDownHandler,
    mouseUpHandler,
  }
}

/**
 * 使用鼠标 距离移动
 *
 * @export
 * @returns {{ resetMouseMove: () => void; getDelta: (currentMousePosition: Point) => { deltaX: number; deltaY: number; }; }}
 */
export function useMouseMoveDelta() {
  let MoveIndex = 0
  const lastMousePosition = { x: 0, y: 0 } // 用来存储上一次的鼠标位置
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
