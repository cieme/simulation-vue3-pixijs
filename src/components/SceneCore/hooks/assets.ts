import { reactive, onBeforeUnmount } from 'vue'
import { Assets, Spritesheet, Texture, type BitmapFont } from 'pixi.js'
import type { IAssets } from '@/components/SceneCore/types/hooks'
// 预先导入当前目录下所有 png 文件，并把结果作为 URL 处理
// const images = import.meta.glob('/src/assets/icons/**/*.png', { eager: true })

export const assets = reactive<IAssets>({
  sheet: null,
  font: null,
  isLoaded: false,
})
const options = {
  SHEET_URL: '/public_resource/alias.json',
  BITMAP_FONT_URL: '/bmfont/font.fnt',
}
Assets.addBundle('main', options)

/**
 * 使用静态资源
 *
 * @export
 * @returns {{ assets: any; }}
 */
export function useAssets() {
  Assets.loadBundle('main').then((bundle) => {
    assets.sheet = bundle.SHEET_URL
    assets.font = bundle.BITMAP_FONT_URL
    assets.isLoaded = true
  })
  function clearAssets() {}
  onBeforeUnmount(() => {
    if (import.meta.env.PROD) {
      clearAssets()
    }
  })
  return {
    assets,
    clearAssets,
  }
}
