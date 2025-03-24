import mitt from 'mitt'
import type { MittEvents } from '@SceneCore/types/mitt'
export * from '@SceneCore/enum/index'
const emitter = mitt<MittEvents>()
export default emitter
