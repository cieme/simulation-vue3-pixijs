<template>
  <div class="header flex justify-between items-center">
    <div class="flex items-center gap-4">
      <div class="text-gray-400 text-sm">LOGO</div>
      <div class="text-sm">
        <slot>
          {{ title }}
        </slot>
      </div>
    </div>
    <div class="">
      <a-dropdown arrow>
        <a class="ant-dropdown-link cursor-pointer flex items-center gap-1" @click.prevent>
          <a-avatar :size="40" class="text-gray-100 bg-gray-900">admin</a-avatar>
          <CaretDownOutlined />
        </a>
        <template #overlay>
          <a-menu @click="onClick">
            <a-menu-item key="1">
              <a href="javascript:;">控制台</a>
            </a-menu-item>
            <a-menu-item key="logout">
              <a href="javascript:;">登出</a>
            </a-menu-item>
          </a-menu>
        </template>
      </a-dropdown>
    </div>
  </div>
</template>
<script setup lang="ts">
import { useRouter } from 'vue-router'
import { CaretDownOutlined } from '@ant-design/icons-vue'
import type { MenuProps } from 'ant-design-vue'
import { useUserStore } from '@/stores/user'

interface IHeader {
  title?: string
}
const props = withDefaults(defineProps<IHeader>(), {
  title: '离散仿真工具',
})
const router = useRouter()
const userStore = useUserStore()
const onClick: MenuProps['onClick'] = ({ key }) => {
  if (key === 'logout') {
    userStore.logout();
    router.replace('/login')
  }
}
</script>
<style lang="scss" scoped>
@use '@/assets/styles/variable.scss' as *;
.header {
  height: $header-height;
  background-color: $header-bg;
  @apply text-white pl-5 pr-2;
}
</style>
