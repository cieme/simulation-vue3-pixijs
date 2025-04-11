import { type PointData } from 'pixi.js'
import { type ILink, type T_LINK_TYPE } from '@/components/SceneCore/types/link.ts'
export class Link implements ILink {
  public uniqueId: string
  public start: string
  public end?: string
  public linkType: T_LINK_TYPE = 'next'
  public linking?: PointData
  public point: Array<PointData> = []
  public interfaceEnterId?: string
  public interfaceExitId?: string

  constructor(props: Omit<Link, 'linkType' | 'point'> & Pick<Partial<Link>, 'linkType' | 'point'>) {
    this.uniqueId = props.uniqueId
    this.start = props.start
    this.end = props.end

    this.linking = props.linking
    this.interfaceEnterId = props.interfaceEnterId
    this.interfaceExitId = props.interfaceExitId

    if (props.linkType) {
      this.linkType = props.linkType
    }
    if (props.point) {
      this.point = props.point
    }
  }
}
