import type { INodeItem } from '@/components/SceneCore/types/hooks'

export default class NodeItem implements INodeItem {
  base: INodeItem['base']
  nextLinkNode: INodeItem['nextLinkNode'] = null
  prevLinkNode: INodeItem['prevLinkNode'] = null
  iconNode: INodeItem['iconNode'] = null
  selectNode: INodeItem['selectNode'] = null
  constructor(params: INodeItem) {
    this.base = params.base
    this.processingAttribute(params)
  }
  processingAttribute(params: INodeItem) {
    const keys = Object.keys(params) as Array<keyof INodeItem>
    keys.forEach((key) => {
      if (key === 'base') {
        return
      }
      const value = params[key]
      if (value) {
        this[key] = value
      }
    })
  }
}
