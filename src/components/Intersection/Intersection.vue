<template>
  <div class="w-full">
    <slot :visible="targetIsVisible"></slot>
    <div ref="refObserver" class=""></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface IIntersection {
  callback?: () => void
}
const props = withDefaults(defineProps<IIntersection>(), {
  callback: undefined,
})

const refObserver = ref<HTMLDivElement>()
const targetIsVisible = ref(false)

const { stop } = useIntersectionObserver(refObserver, ([{ isIntersecting }], observerElement) => {
  targetIsVisible.value = isIntersecting
  if (isIntersecting) {
    props.callback && props.callback()
  }
})
onUnmounted(() => stop())
</script>
<style lang="scss" scoped></style>
