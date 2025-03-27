import {type PointData} from "pixi.js"
export type T_LINK_TYPE = "prev" | 'next'
export interface ILink {
  uniqueId: string;
  start: string;
  end?: string;
  /* 连接类型-起点类型 */
  linkType: T_LINK_TYPE;
  /*连接点*/
  point: Array<PointData>;
  /* 链接中的坐标,鼠标移动 */
  linking?: PointData;
  /* 配置 */
  config?: PointData;
  /**
   * 接口入口id
   */
  interfaceEnterId?: string;
  /**
   * 接口出口Id
   */
  interfaceExitId?: string;
}
