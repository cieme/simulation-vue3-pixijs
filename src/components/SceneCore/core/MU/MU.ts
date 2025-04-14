export default class MU {
  /**
   * 组件尺寸
   *
   * @type {{ length: number; width: number; height: number; }}
   */
  componentSize = {
    length: 0,
    width: 0,
    height: 0,
  }

  /**
   * 摆放布局
   *
   * @type {{ x: number; y: number; z: number; }}
   */
  layout = {
    x: 1,
    y: 1,
    z: 1,
  }

  _grid = {}
  constructor({ layout }: { layout: MU['layout'] }) {
    this.layout = layout || this.layout
  }
}
