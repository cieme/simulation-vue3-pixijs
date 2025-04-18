import type { INodeItem } from '@/components/SceneCore/types/hooks'
import { E_COMPONENT_TYPE } from '@/components/SceneCore/enum'
export default class NodeItem implements INodeItem {
  id: string
  type: E_COMPONENT_TYPE
  node: INodeItem['node']
  nextLinkNode: INodeItem['nextLinkNode'] = null
  prevLinkNode: INodeItem['prevLinkNode'] = null
  iconNode: INodeItem['iconNode'] = null
  selectNode: INodeItem['selectNode'] = null
  constructor(params: INodeItem) {
    this.node = params.node
    this.id = params.id
    this.type = params.type
    this.processingAttribute(params)
  }
  processingAttribute(params: INodeItem) {
    const keys = Object.keys(params) as Array<keyof INodeItem>
    keys.forEach((key) => {
      if (key === 'node' || key === 'id' || key === 'type') {
        return
      }
      const value = params[key]
      if (value) {
        this[key] = value
      }
    })
  }
}
