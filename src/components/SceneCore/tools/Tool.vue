<template>
  <a-space>
    <a-radio-group
      :value="userData.operationStatus"
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
    <a-input-number
      size="small"
      :value="refScale.x"
      style="width: 80px"
      :min="minScale"
      :max="maxScale"
      :precision="1"
      :step="0.1"
      string-mode
      @change="changeScale"
    />
    <a-button size="small" type="primary" @click="shotScreen">截图</a-button>
  </a-space>
</template>

<script setup lang="ts">
import { reactive, onBeforeUnmount, onMounted, watchEffect } from 'vue'

import type { RadioChangeEvent, RadioGroupProps } from 'ant-design-vue/es/radio'
import type { InputNumberProps } from 'ant-design-vue/es/input-number'

import {
  SelectOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  GatewayOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons-vue'
import type { Application } from 'pixi.js'

import { ENUM_TOOL } from '@/components/SceneCore/enum/ENUM_TOOL'
import emitter, { E_EVENT_SCENE } from '@/components/SceneCore/mitt/mitt'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import { useScale } from '@/components/SceneCore/hooks/scale'
import { E_MOUSE_BUTTON } from '../enum/mouse'
interface IToolProps {
  app: Application
  userData: ICreateNodeParams['userData']
  root: ICreateNodeParams['root']
}
const props = withDefaults(defineProps<IToolProps>(), {
  app: () => ({}) as Application,
  userData: () => ({}) as ICreateNodeParams['userData'],
  root: () => ({}) as ICreateNodeParams['root'],
})

const state = reactive<{ size: RadioGroupProps['size'] }>({
  size: 'small',
})
setTimeout(() => {}, 0)
const changeToolStatus = (e: RadioChangeEvent) => {
  // eslint-disable-next-line vue/no-mutating-props
  props.userData.operationStatus.value = e.target.value
  emitter.emit(E_EVENT_SCENE.SCENE_OPERATION_STATUS, e.target.value)
}

let disposeDrag: (() => void) | null = null

function addMoveEvent() {
  const { dispose } = useDragComponentHook({
    eventNode: props.app.stage,
    app: props.app,
    userData: props.userData,
    buttons: [E_MOUSE_BUTTON.MIDDLE],
    moveHandler: (deltaX, deltaY, e) => {
      // eslint-disable-next-line vue/no-mutating-props
      props.root.position.x = props.root.position.x + deltaX
      // eslint-disable-next-line vue/no-mutating-props
      props.root.position.y = props.root.position.y + deltaY
    },
  })
  disposeDrag = dispose
  document.body.classList.add('cursor-pointer')
}

function removeMoveEvent() {
  document.body.classList.remove('cursor-pointer')
  if (disposeDrag) {
    disposeDrag()
  }
}
let disposeScale: (() => void) | null = null
const { dispose, refScale, minScale, maxScale, addEvent } = useScale({
  targetNode: props.root,
  app: props.app,
})

const changeScale: InputNumberProps['onChange'] = (value) => {
  if (value === null) {
    refScale.value.x = minScale
    refScale.value.y = minScale
  } else {
    const number = Number(value)
    refScale.value.x = number
    refScale.value.y = number
  }
}
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
  props.app.canvas.toBlob(
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
