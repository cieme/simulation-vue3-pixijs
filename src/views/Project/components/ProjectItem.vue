<template>
  <section class="project-item text-sm text-gray-200">
    <div class="project-item-header flex items-center justify-between">
      <img src="@/assets/images/icon_project-item.png" class="icon_project-item" />
      <div class="relative" ref="target">
        <SettingFilled class="btn" @click="toggleHandle" />
        <nav v-if="visible" class="absolute top-0 mr-1 h-full right-full flex">
          <CopyFilled class="btn" />
          <EditFilled class="btn" />
          <DeleteFilled class="btn" />
          <Icon class="btn">
            <template #component="svgProps">
              <User v-bind="svgProps" />
            </template>
          </Icon>
        </nav>
      </div>
    </div>
    <div class="project-item-content pt-1 pb-1 flex items-center justify-between text">
      <div>{{}}</div>
      <div>
        <Icon class="">
          <template #component="svgProps">
            <User v-bind="svgProps" />
          </template>
        </Icon>
      </div>
    </div>
    <div class="project-item-footer mt-1 flex items-center justify-between">
      <div class="text-xs text">共 <span class="text-base text-white">18</span> 个方案</div>
      <div class="text-xs">2024-08-15 09:21:50</div>
    </div>
  </section>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { onClickOutside } from '@vueuse/core'
import Icon, { SettingFilled, CopyFilled, EditFilled, DeleteFilled } from '@ant-design/icons-vue'
import { User } from '@vicons/fa'

import { type IProject, type IProjectScene } from '@/api/types/project_types'
interface IProjectItem {
  mode: IProjectScene
}
const props = withDefaults(defineProps<IProjectItem>(), {
  mode: () => ({}) as IProjectScene,
})

const target = ref()
const visible = ref(false)
const toggleHandle = () => {
  visible.value = !visible.value
}
onClickOutside(target, () => (visible.value = false))
</script>
<style lang="scss" scoped>
.project-item {
  border-radius: 4px;
  padding: 10px 8px;
  background-color: #3c404a;
  transition:
    background-color 0.3s,
    color 0.3s,
    box-shadow 0.3s;
  cursor: pointer;
  border: 1px solid rgba(0, 0, 0, 0);
  &.is-active {
    background-color: #363a43;
    box-shadow: 0 0 6px #407cf4;
    border-color: #407cf4;
  }
}
.icon_project-item {
  width: 63px;
  height: 56px;
}

.btn {
  @apply text-primary hover:text-white hover:bg-primary w-6 h-6 rounded flex justify-center items-center text-sm;
}
.text {
  color: #d2e1ff;
}
</style>
