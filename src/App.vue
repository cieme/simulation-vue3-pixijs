<script setup lang="ts">
import { RouterView } from 'vue-router'
import { theme } from 'ant-design-vue'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider
    :csp="{ nonce: 'YourNonceCode' }"
    component-size="middle"
    :locale="zhCN"
    :theme="{
      algorithm: theme.darkAlgorithm,
    }"
  >
    <RouterView />
  </a-config-provider>
</template>
