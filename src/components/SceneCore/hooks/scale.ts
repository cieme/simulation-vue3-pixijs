import { Container } from 'pixi.js'
export function useScale({ targetNode }: { targetNode: Container }) {
  const dispose = () => {}
  return {
    dispose,
  }
}
