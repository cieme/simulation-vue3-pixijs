import { inject } from 'vue'
import { Application, Container } from 'pixi.js'
import type { IAssets, ICreateNodeParams } from '@/components/SceneCore/types/hooks'
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
