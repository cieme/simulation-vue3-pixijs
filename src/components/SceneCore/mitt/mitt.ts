import mitt from 'mitt'
import type { MittEvents } from '@SceneCore/types/mitt'
export { E_EVENT_SCENE } from '@SceneCore/enum/mitt'
const emitter = mitt<MittEvents>()
export default emitter
