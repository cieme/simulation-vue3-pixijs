<script setup lang="ts">
import { RouterView } from 'vue-router'
</script>

<template>
  <a-config-provider :csp="{ nonce: 'YourNonceCode' }" component-size="middle">
    <RouterView />
  </a-config-provider>
</template>
