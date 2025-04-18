<template>
  <a-space>
    <a-radio-group
      :value="userData.Ref_operationStatus"
      buttonStyle="solid"
      :size="state.size"
      @change="changeToolStatus"
    >
      <a-radio-button :value="ENUM_TOOL.SELECT" title="选择组件">
        <SelectOutlined />
      </a-radio-button>
      <a-radio-button :value="ENUM_TOOL.LINE_LINK" title="链接组件">
        <NodeIndexOutlined />
      </a-radio-button>
    </a-radio-group>
    <a-button title="缩放" size="small" class="w-10 text-center">{{ Ref_scale.x }}</a-button>
    <a-button title="缩放" size="small" @click="resetScale"><ReloadOutlined /></a-button>
    <a-button title="截图" size="small" type="primary" @click="shotScreen"
      ><VideoCameraOutlined
    /></a-button>
  </a-space>
</template>

<script setup lang="ts">
import { reactive, onBeforeUnmount, onMounted, watchEffect } from 'vue'

import type { RadioChangeEvent, RadioGroupProps } from 'ant-design-vue/es/radio'

import {
  SelectOutlined,
  NodeIndexOutlined,
  VideoCameraOutlined,
  ReloadOutlined,
} from '@ant-design/icons-vue'
import type { Application, PointData } from 'pixi.js'

import { ENUM_TOOL } from '@/components/SceneCore/enum/ENUM_TOOL'
import emitter, { E_EVENT_SCENE } from '@/components/SceneCore/mitt/mitt'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import { useScale } from '@/components/SceneCore/hooks/scale'
import { E_MOUSE_BUTTON } from '../enum/ENUM_MOUSE'
interface IToolProps {
  userData: ICreateNodeParams['userData']
  Ref_scale: PointData
}
const props = withDefaults(defineProps<IToolProps>(), {
  userData: () => ({}) as ICreateNodeParams['userData'],
  Ref_scale: () => ({ x: 1, y: 1 }) as PointData,
})

const state = reactive<{ size: RadioGroupProps['size'] }>({
  size: 'small',
})
setTimeout(() => {}, 0)
const changeToolStatus = (e: RadioChangeEvent) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.userData.Ref_operationStatus.value = e.target.value
  emitter.emit(E_EVENT_SCENE.SCENE_OPERATION_STATUS, e.target.value)
}

let disposeDrag: (() => void) | null = null

function addMoveEvent() {
  const { dispose } = useDragComponentHook({
    eventNode: props.userData.app.stage,
    app: props.userData.app,
    userData: props.userData,
    buttons: [E_MOUSE_BUTTON.MIDDLE],
    moveHandler: ({ deltaX, deltaY }) => {
      // eslint-disable-next-line vue/no-mutating-props
      props.userData.root.position.x = props.userData.root.position.x + deltaX
      // eslint-disable-next-line vue/no-mutating-props
      props.userData.root.position.y = props.userData.root.position.y + deltaY
    },
  })
  disposeDrag = dispose
  // document.body.classList.add('cursor-pointer')
}

function removeMoveEvent() {
  // document.body.classList.remove('cursor-pointer')
  if (disposeDrag) {
    disposeDrag()
  }
}
let disposeScale: (() => void) | null = null
const { dispose, minScale, maxScale, addEvent, resetScale } = useScale({
  targetNode: props.userData.root,
  app: props.userData.app,
  Ref_scale: props.Ref_scale,
})

disposeScale = dispose

function removeScaleEvent() {
  if (disposeScale) {
    disposeScale()
  }
}
onMounted(() => {
  addEvent()
  addMoveEvent()
})
onBeforeUnmount(() => {
  removeMoveEvent()
  removeScaleEvent()
})
const shotScreen = () => {
  props.userData.app.canvas.toBlob(
    (blob) => {
      if (!blob) return
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = 'canvas.png'
      a.click()
      URL.revokeObjectURL(a.href)
      a.remove()
    },
    'image/png',
    1,
  )
}
</script>
<style lang="scss" scoped></style>
