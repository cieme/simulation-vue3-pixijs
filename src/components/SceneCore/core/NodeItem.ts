import type { INodeItem } from '@/components/SceneCore/types/hooks'

export default class NodeItem implements INodeItem {
  id: string
  node: INodeItem['node']
  nextLinkNode: INodeItem['nextLinkNode'] = null
  prevLinkNode: INodeItem['prevLinkNode'] = null
  iconNode: INodeItem['iconNode'] = null
  selectNode: INodeItem['selectNode'] = null
  constructor(params: INodeItem) {
    this.node = params.node
    this.id = params.id
    this.processingAttribute(params)
  }
  processingAttribute(params: INodeItem) {
    const keys = Object.keys(params) as Array<keyof INodeItem>
    keys.forEach((key) => {
      if (key === 'node' || key === 'id') {
        return
      }
      const value = params[key]
      if (value) {
        this[key] = value
      }
    })
  }
}
