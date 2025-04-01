import { ref } from 'vue'
import { Container, Application } from 'pixi.js'
import type { FederatedWheelEvent } from 'pixi.js'
import Big from 'big.js'
export function useScale({
  targetNode,
  app,
  scale,
}: {
  targetNode: Container
  app: Application
  scale?: number
}) {
  if (scale) {
    targetNode.scale.set(scale, scale)
  }
  const refScale = ref(targetNode.scale)
  const minScale = 0.5
  const maxScale = 5
  const onWheel = (e: FederatedWheelEvent) => {
    const currentScale = new Big(refScale.value.x)
    let delta = 0.1
    if (e.deltaY < 0) {
      delta = -delta
    }
    const newScale = currentScale.plus( delta)
    if (newScale.gte(minScale) && newScale.lte(maxScale)) {
      refScale.value.x = newScale.toNumber()
      refScale.value.y = newScale.toNumber()
    }
    targetNode.scale = refScale.value
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

  return {
    refScale,
    minScale,
    maxScale,
    addEvent,
    removeEvent,
    dispose,
  }
}
