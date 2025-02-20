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
      <Intersection class="intersection" :callback="getData"></Intersection>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, toRaw, computed } from 'vue'
import { PlusOutlined } from '@ant-design/icons-vue'
import Header from '@/components/Header/index.vue'
import Intersection from '@/components/Intersection/Intersection.vue'

const getData = () => {
  console.log('data')
}
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
.slide {
  width: $project-list-width;
  background-color: $project-list-bg;
  height: calc(100vh - #{$header-height});
}
</style>
