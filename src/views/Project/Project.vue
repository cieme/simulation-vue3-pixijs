<template>
  <div>
    <Header></Header>
    <div class="slide flex flex-col">
      <div class="flex flex-col justify-center">
        <div class="pt-4 pb-4 pl-7 pr-7">
          <a-button class="w-full" type="primary"
            ><template #icon><PlusOutlined /></template>新建项目</a-button
          >
        </div>
      </div>
      <Intersection class="intersection" :callback="getData">
        <div class="pl-2 pr-2 flex flex-col gap-2">
          <ProjectItem :mode="item" v-for="item in list" :key="item.dbId" />
        </div>
      </Intersection>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRaw, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import Header from '@/components/Header/index.vue'
import Intersection from '@/components/Intersection/Intersection.vue'
import ProjectItem from './components/ProjectItem.vue'
import { usePagination } from '@/utils/hooks/usePagination'

import { type IProject, type IProjectScene } from '@/api/types/project_types'
import { APGetProjectList } from '@/api/project/project'
const po = ref({
  projectName: '',
  type: '1',
})
const { currentPage, limit, count, hasNextPage, reset, nextPage } = usePagination({
  defaultPage: 0,
  total: 1,
})
const list = ref<IProjectScene[]>([])
const getData = () => {
  if (!hasNextPage.value) {
    return
  }
  nextPage()
  const params: IProject = {
    page: currentPage.value,
    limit: limit.value,
    po: toRaw(po.value),
  }
  APGetProjectList(params).then((res) => {
    // 处理数据
    list.value.push(...res.data.records)
    count.value = res.data.total
  })
}
const resetParams = () => {
  reset()
}
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
.slide {
  width: $project-list-width;
  background-color: $project-list-bg;
  height: calc(100vh - #{$header-height});
}
.intersection {
  overflow-y: auto;
}
</style>
