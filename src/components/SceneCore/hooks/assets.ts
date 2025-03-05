import { shallowReactive } from 'vue'
import { Assets, Spritesheet, Texture, type SpritesheetData } from 'pixi.js'
import type { IAssets } from '@/components/SceneCore/types/hooks'
// 预先导入当前目录下所有 png 文件，并把结果作为 URL 处理
// const images = import.meta.glob('/src/assets/icons/**/*.png', { eager: true })

const assets = shallowReactive<IAssets>({
  sheet: null,
})
/**
 * 使用静态资源
 *
 * @export
 * @returns {{ assets: any; }}
 */
export function useAssets() {
  Assets.load('/public_resource/alias.json').then((sheet: Spritesheet) => {
    assets.sheet = sheet
  })

  return {
    assets,
  }
}
