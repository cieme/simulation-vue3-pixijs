<template>
  <div
    class="scene-item bg-white rounded shadow-lg overflow-hidden cursor-pointer"
    @click="clickHandle"
  >
    <div class="poster bg-gradient-to-r from-gray-100 to-gray-300">
      <img class="block w-full h-full object-cover" :src="mode.imgUrl || EmptySvg" alt="" />
    </div>
    <div class="p-4">
      <div class="flex justify-between">
        <div>{{ mode.sceneName }}</div>
        <div class="relative text-primary" ref="target">
          <SettingFilled class="btn" @click.stop="toggleHandle" />
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
      <div class="text-xs text-gray-400">{{ mode.createUser }}</div>
      <div class="text-xs text-gray-400">上次更新：{{ mode.updateTime }}</div>
    </div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive } from 'vue'
import { useRouter } from 'vue-router'
import { onClickOutside } from '@vueuse/core'

import Icon, { SettingFilled, CopyFilled, EditFilled, DeleteFilled } from '@ant-design/icons-vue'
import { User } from '@vicons/fa'
import EmptySvg from '@assets/images/no-img.svg'
import type { ISceneItem } from '@/api/types/scene_types'

interface IScentItemProps {
  mode: ISceneItem
}
const props = withDefaults(defineProps<IScentItemProps>(), {
  mode: () => ({}) as ISceneItem,
})
const router = useRouter()
const clickHandle = () => {
  const query = {
    projectDbId: props.mode.projectDbId,
    sceneId: props.mode.dbId,
  }
  router.push({ path: `/scene`, query })
}

/*  */
const target = ref()
const visible = ref(false)
const toggleHandle = () => {
  visible.value = !visible.value
}
onClickOutside(target, () => (visible.value = false))
</script>
<style lang="scss" scoped>
.poster {
  @apply h-56;
}
.btn {
  @apply text-primary hover:text-white hover:bg-primary w-6 h-6 rounded flex justify-center items-center text-sm cursor-pointer;
}
</style>
