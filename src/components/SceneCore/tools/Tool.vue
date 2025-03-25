<template>
  <div>
    <a-radio-group
      :value="userData.operationStatus"
      buttonStyle="solid"
      :size="state.size"
      @change="changeToolStatus"
    >
      <a-radio-button :value="ENUM_TOOL.SELECT" title="选择组件">
        <SelectOutlined />
      </a-radio-button>
      <a-radio-button :value="ENUM_TOOL.MOVE_ROOT_CONTAINER" title="移动画布">
        <ColumnWidthOutlined />
        <div class="w-full h-full absolute top-0 right-0 flex justify-center items-center">
          <ColumnHeightOutlined />
        </div>
      </a-radio-button>
      <a-radio-button :value="ENUM_TOOL.LINE_LINK" title="链接组件">
        <NodeIndexOutlined />
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { reactive, onBeforeUnmount } from 'vue'

import type { RadioChangeEvent, RadioGroupProps } from 'ant-design-vue/es/radio'

import {
  SelectOutlined,
  ColumnWidthOutlined,
  ColumnHeightOutlined,
  GatewayOutlined,
  NodeIndexOutlined,
} from '@ant-design/icons-vue'
import type { Application } from 'pixi.js'

import { ENUM_TOOL } from '@enum/ENUM_TOOL'
import emitter, { E_EVENT_SCENE } from '@SceneCore/mitt/mitt'
import type { ICreateNodeParams } from '@/components/SceneCore/types/hooks'
import { useDragComponentHook } from '@/components/SceneCore/eventHooks/mouseHook'
import { useScale } from '@SceneCore/hooks/scale'
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
const changeToolStatus = (e: RadioChangeEvent) => {
  if (e.target.value === ENUM_TOOL.MOVE_ROOT_CONTAINER) {
    addMoveEvent()
  } else {
    removeMoveEvent()
  }
  props.userData.operationStatus.value = e.target.value
  emitter.emit(E_EVENT_SCENE.SCENE_OPERATION_STATUS, e.target.value)
}

let disposeDrag: (() => void) | null = null

function addMoveEvent() {
  const { dispose } = useDragComponentHook({
    eventNode: props.app.stage,
    app: props.app,
    userData: props.userData,
    moveHandler: (deltaX, deltaY, e) => {
      props.root.position.x = props.root.position.x + deltaX
      props.root.position.y = props.root.position.y + deltaY
    },
  })
  disposeDrag = dispose
  document.body.classList.add('cursor-pointer')
}

function removeMoveEvent() {
  document.body.classList.remove('cursor-pointer')
  disposeDrag && disposeDrag()
}

onBeforeUnmount(() => {
  removeMoveEvent()
})
</script>
<style lang="scss" scoped></style>
