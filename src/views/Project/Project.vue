<template>
  <div>
    <Header></Header>
    <div class="flex">
      <div class="slide flex flex-col pb-2" :class="collapsed && 'collapsed'">
        <div class="flex flex-col justify-center">
          <div class="pt-4 pb-4 pl-7 pr-7">
            <a-button class="w-full" type="primary"
              ><template #icon><PlusOutlined /></template>新建项目</a-button
            >
          </div>
        </div>
        <Intersection class="intersection" :callback="getData">
          <div class="pl-2 pr-2 flex flex-col gap-2">
            <ProjectItem
              :mode="item"
              :is-active="item.dbId === current"
              v-for="item in list"
              :key="item.dbId"
              @click="setCurrent(item.dbId)"
            />
          </div>
        </Intersection>
      </div>
      <div class="content flex flex-col relative" :class="collapsed && 'collapsed'">
        <div class="collapsed-btn" @click="collapsed = !collapsed"><LeftOutlined /></div>
        <div class="flex justify-between items-center p-4">
          <span class="text-gray-900">场景管理</span>
          <a-button type="primary" class="ml-2">
            <template #icon><PlusOutlined /></template>
            新建场景
          </a-button>
        </div>
        <SceneList class="pt-0 p-4" v-if="current" :key="current" :project-id="current" />
      </div>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, toRaw, computed } from 'vue'
import { PlusOutlined, LeftOutlined } from '@ant-design/icons-vue'
import Header from '@/components/Header/index.vue'
import Intersection from '@/components/Intersection/Intersection.vue'
import ProjectItem from './components/ProjectItem.vue'
import SceneList from './components/SceneList.vue'
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
const current = ref<string>()
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
    setCurrent('0')
    console.log(current.value)
  })
}
const resetParams = () => {
  reset()
}
const setCurrent = (id: string) => {
  if (id === current.value) {
    return
  }
  const inList = list.value.find((item) => item.dbId === id)
  if (inList) {
    current.value = id
  } else {
    current.value = list.value?.[0]?.dbId
  }
}

const collapsed = ref(false)
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
.slide {
  width: $project-list-width;
  background-color: $project-list-bg;
  height: calc(100vh - #{$header-height});
  overflow: hidden;
  transition: width 0.2s linear;
  &.collapsed {
    width: 0;
  }
}
.intersection {
  overflow-y: auto;
}
.content {
  width: calc(100% - $project-list-width);
  height: calc(100vh - #{$header-height});
  @apply overflow-y-auto;
  transition: width 0.2s linear;
  &.collapsed {
    width: 100%;
  }
}

.collapsed-btn {
  top: 50%;
  left: 0;
  transform: translateY(-50%);
  transition: all 0.2s;
  @apply w-6 h-10 flex justify-center items-center z-10 text-xs absolute rounded-full bg-white shadow-lg cursor-pointer hover:h-12;
}
</style>
