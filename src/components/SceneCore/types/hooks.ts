import type { Ref } from 'vue'
import { type Spritesheet, Container, Application } from 'pixi.js'
import type { ISourceProps } from '@/components/SceneCore/types/props'

export interface IAssets {
  sheet: Spritesheet | null
}
export interface ICreateNodeParams {
  props: ISourceProps
  config: any
  assets: IAssets
  root: Container
  app: Application
  userData: {
    nodeList: Map<string, Container>
    selectedNodes: Ref<Container[]>
  }
}
