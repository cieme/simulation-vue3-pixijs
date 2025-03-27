import {type PointData} from "pixi.js"
import {type ILink,type T_LINK_TYPE} from  '@SceneCore/types/link.ts'
export class Link implements ILink {
  public uniqueId: string;
  public start: string;
  public end?: string;
  public linkType: T_LINK_TYPE = 'next';
  public linking ?:PointData;
  public point: Array<PointData> = [];
  public interfaceEnterId ?: string;
  public interfaceExitId ?: string;
  constructor({uniqueId,start}:{uniqueId:Link['uniqueId'],start:Link['start']}){
    this.uniqueId=uniqueId;
    this.start=start;
  }
}
