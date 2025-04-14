interface IMUParams {
  layout: MU['layout']
  componentSize: MU['componentSize']
}

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

  /**
   * 网格物料
   * @type {{ [key: string]: string }}
   */
  _gridMu: { [key: string]: string } = {}

  /*  */
  constructor({ layout, componentSize }: IMUParams) {
    this.layout = layout
    this.componentSize = componentSize
  }
  getKey(x: number, y: number, z: number) {
    return `${x}_${y}_${z}`
  }
  /* 扫描全部网格，找到第一个空位 */
  placeOneItem() {
    const maxZ = this.layout.z
    const maxX = this.layout.x
    const maxY = this.layout.y
    const box = this._gridMu
    for (let y = 0; y < maxY; y++) {
      for (let x = 0; x < maxX; x++) {
        for (let z = 0; z < maxZ; z++) {
          const key = this.getKey(x, y, z)
          if (!box[key]) {
            box[key] = key
            console.log(`新的物体位置: (${x}, ${y}, ${z})`)
            return { x, y, z, key }
          }
        }
      }
    }

    console.log('空间已满，无法放置更多物品。')
    return null
  }
  /* 优先使用这个, 缓存位置 */
  cacheX = 0
  cacheY = 0
  cacheZ = 0
  placeOneItemWithCache() {
    const { x: maxX, y: maxY, z: maxZ } = this.layout
    const box = this._gridMu

    for (let y = this.cacheY; y < maxY; y++) {
      for (let x = this.cacheX; x < maxX; x++) {
        for (let z = this.cacheZ; z < maxZ; z++) {
          const key = this.getKey(x, y, z)
          if (!box[key]) {
            box[key] = key
            console.log(`新的物体位置: (${x}, ${y}, ${z})`)

            // 更新缓存位置
            this.cacheX = x
            this.cacheY = y
            this.cacheZ = z + 1
            if (this.cacheZ >= maxZ) {
              this.cacheZ = 0
              this.cacheX += 1
              if (this.cacheX >= maxX) {
                this.cacheX = 0
                this.cacheY += 1
              }
            }

            return { x, y, z, key }
          }
        }
        this.cacheZ = 0
      }
      this.cacheX = 0
    }

    console.log('空间已满，无法放置更多物品。')
    return null
  }
}
