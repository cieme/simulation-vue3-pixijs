<script setup lang="ts">
import { RouterView } from 'vue-router'
import zhCN from 'ant-design-vue/es/locale/zh_CN'
</script>

<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }" component-size="middle" :locale="zhCN">
    <RouterView />
  </a-config-provider>
</template>
