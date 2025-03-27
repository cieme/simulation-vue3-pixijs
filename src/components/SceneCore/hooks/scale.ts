import { ref } from 'vue'
import { Container, Application } from 'pixi.js'
import type { FederatedWheelEvent } from 'pixi.js'
export function useScale({
  targetNode,
  app,
  scale,
}: {
  targetNode: Container
  app: Application
  scale: number
}) {
  if (scale) {
    targetNode.scale.set(scale, scale)
  }
  const refScale = ref(targetNode.scale)
  const onWheel = (e: FederatedWheelEvent) => {
    if (e.deltaY > 0) {
      refScale.value.x -= 0.1
      refScale.value.y -= 0.1
    } else {
      refScale.value.x += 0.1
      refScale.value.y += 0.1
    }
    targetNode.scale = refScale.value
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
