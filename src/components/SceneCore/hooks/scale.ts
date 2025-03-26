import { Container, Application } from 'pixi.js'
import type { FederatedWheelEvent } from 'pixi.js'
export function useScale({ targetNode, app }: { targetNode: Container; app: Application }) {
  const onWheel = (e: FederatedWheelEvent) => {
    if (e.deltaY > 0) {
      targetNode.scale.x -= 0.1
      targetNode.scale.y -= 0.1
    } else {
      targetNode.scale.x += 0.1
      targetNode.scale.y += 0.1
    }
  }
  targetNode.interactive = true
  function addEvent() {
    app.stage.on('wheel', onWheel)
  }
  addEvent()
  function removeEvent() {
    app.stage.off('wheel', onWheel)
  }
  const dispose = () => {
    removeEvent()
  }

  return {
    addEvent,
    removeEvent,
    dispose,
  }
}
