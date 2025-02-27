import { inject } from 'vue'
import { Application, Container } from 'pixi.js'
import { type IAssets } from './assets'
export function useApp() {
  const app = inject<Application>('app')
  const assets = inject<IAssets>('assets')
  const root = inject<Container>('root')
  return {
    app: app as Application,
    assets,
    root: root as Container,
  }
}
