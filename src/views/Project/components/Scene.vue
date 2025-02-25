<template>
  <Intersection class="intersection h-full" :callback="getData">
    <a-row :gutter="[16, 16]">
      <a-col :span="6" v-for="item in list" :key="item.dbId"><SceneItem :mode="item" /></a-col>
    </a-row>
  </Intersection>
</template>
<script setup lang="ts">
import { ref, reactive, toRaw, computed } from 'vue'
import SceneItem from './SceneItem.vue'
import { usePagination } from '@/utils/hooks/usePagination'
import { APGetSceneList } from '@/api/scene/scene'
import type { ISceneParams, ISceneItem } from '@/api/types/scene_types'

interface ISceneProps {
  projectId: string
}
const props = withDefaults(defineProps<ISceneProps>(), {
  projectId: '',
})

const { currentPage, limit, count, hasNextPage, reset, nextPage } = usePagination({
  defaultPage: 0,
  pageSize: 12,
  total: 1,
})

const list = ref<ISceneItem[]>([])
const getData = () => {
  if (!hasNextPage.value) {
    return
  }
  nextPage()
  const params: ISceneParams = {
    page: currentPage.value,
    limit: limit.value,
    po: {
      projectDbId: props.projectId,
    },
  }
  APGetSceneList(params).then((res) => {
    // 处理数据
    list.value.push(...res.data.records)
    count.value = res.data.total
  })
}
</script>
<style lang="scss" scoped></style>
