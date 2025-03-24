<template>
  <div>
    <a-radio-group v-model:value="state.value" buttonStyle="solid" size="small">
      <a-radio-button :value="ENUM_TOOL.SELECT" title="选择组件">
        <SelectOutlined />
      </a-radio-button>
      <a-radio-button :value="ENUM_TOOL.RECT_SELECT" title="框选组件">
        <GatewayOutlined />
      </a-radio-button>
      <a-radio-button :value="ENUM_TOOL.LINE_LINK" title="链接组件">
        <NodeIndexOutlined />
      </a-radio-button>
    </a-radio-group>
  </div>
</template>

<script setup lang="ts">
import { ref, reactive, h } from 'vue'
import type { SizeType } from 'ant-design-vue/es/config-provider'
import { SelectOutlined, GatewayOutlined, NodeIndexOutlined } from '@ant-design/icons-vue'
import { ENUM_TOOL } from '@enum/ENUM_TOOL'
const state = reactive<{ value: ENUM_TOOL; size: SizeType }>({
  value: ENUM_TOOL.SELECT,
  size: 'small',
})
</script>

<style lang="scss" scoped></style>
