<template>
  <div class="w-full">
    <slot :visible="visible"></slot>
    <div ref="refObserver" :style="{ height: distance + 'px' }"></div>
  </div>
</template>
<script setup lang="ts">
import { ref, reactive, onUnmounted } from 'vue'
import { useIntersectionObserver } from '@vueuse/core'

interface IIntersection {
  callback?: () => void
  distance?: number
}
const props = withDefaults(defineProps<IIntersection>(), {
  callback: undefined,
  distance: 0,
})

const refObserver = ref<HTMLDivElement>()
const visible = ref(false)

const { stop } = useIntersectionObserver(refObserver, ([{ isIntersecting }], observerElement) => {
  visible.value = isIntersecting
  if (isIntersecting) {
    props.callback && props.callback()
  }
})
onUnmounted(() => stop())

defineExpose({
  visible,
})
</script>
<style lang="scss" scoped></style>
