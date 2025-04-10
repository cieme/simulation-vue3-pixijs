import { reactive, onBeforeUnmount } from 'vue'
import { Assets, Spritesheet, Texture, type SpritesheetData } from 'pixi.js'
import type { IAssets } from '@/components/SceneCore/types/hooks'
// 预先导入当前目录下所有 png 文件，并把结果作为 URL 处理
// const images = import.meta.glob('/src/assets/icons/**/*.png', { eager: true })
const SHEET_URL = '/public_resource/alias.json'
export const assets = reactive<IAssets>({
  sheet: null,
})

/**
 * 使用静态资源
 *
 * @export
 * @returns {{ assets: any; }}
 */
export function useAssets() {
  Assets.load(SHEET_URL).then((sheet: Spritesheet) => {
    assets.sheet = sheet
  })
  function clearAssets() {
    const hasSheet = Assets.get(SHEET_URL)
    if (hasSheet) {
      Assets.unload(SHEET_URL)
        .catch((err) => {})
        .finally(() => {
          assets.sheet = null
        })
    }
  }
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
