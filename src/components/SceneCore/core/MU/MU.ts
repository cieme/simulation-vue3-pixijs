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
  /* 取网格中心位置 */
  calculatePosition(x: number, y: number) {
    /* 假设组件尺寸为100*100 */
    const unitWidth = this.componentSize.width / this.layout.x
    const unitHeight = this.componentSize.height / this.layout.y
    const position = {
      x: (x + 0.5) * unitWidth,
      y: (y + 0.5) * unitHeight,
    }
    console.log(position)
  }
}
// new MU({
//   layout: { x: 1, y: 1, z: 1 },
//   componentSize: { width: 100, height: 100, length: 100 },
// }).calculatePosition(0, 0)
// const mu2 = new MU({
//   layout: { x: 1, y: 2, z: 1 },
//   componentSize: { width: 50, height: 100, length: 100 },
// })
// mu2.calculatePosition(0, 0)
// mu2.calculatePosition(0, 1)

const mu3 = new MU({
  layout: { x: 3, y: 3, z: 3 },
  componentSize: { width: 300, height: 300, length: 100 },
})
mu3.calculatePosition(0, 0)
mu3.calculatePosition(0, 1)
mu3.calculatePosition(0, 2)
mu3.calculatePosition(1, 1)
mu3.calculatePosition(1, 2)
mu3.calculatePosition(2, 1)
mu3.calculatePosition(2, 2)

