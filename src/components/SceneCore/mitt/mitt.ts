import mitt from 'mitt'
import type { MittEvents } from '@/components/SceneCore/types/mitt'
export * from '@/components/SceneCore/enum/index'
const emitter = mitt<MittEvents>()
export default emitter
