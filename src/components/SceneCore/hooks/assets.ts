import { shallowReactive } from 'vue'
import { Assets, Spritesheet, Texture, type SpritesheetData } from 'pixi.js'

// 预先导入当前目录下所有 png 文件，并把结果作为 URL 处理
// const images = import.meta.glob('/src/assets/icons/**/*.png', { eager: true })

export interface IAssets {
  sheet: Spritesheet | null
}
const assets = shallowReactive<IAssets>({
  sheet: null,
})
export function useAssets() {
  // Assets.add({ alias: 'default', src: 'default.png' })
  Assets.load('/public_resource/alias.json').then((sheet: Spritesheet) => {
    assets.sheet = sheet
  })

  return {
    assets,
  }
}
