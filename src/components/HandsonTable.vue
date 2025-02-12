<template>
  <div ref="refDom"></div>
</template>
<script setup lang="ts">
import { ref, reactive, onMounted } from 'vue'
import Handsontable from 'handsontable'

import 'handsontable/styles/handsontable.min.css'
import 'handsontable/styles/ht-theme-main.min.css'

const refDom = ref<HTMLDivElement | null>(null)
onMounted(() => {
  if (!refDom.value) return
  const hot = new Handsontable(refDom.value, {
    data: [
      ['', 'Tesla', 'Volvo', 'Toyota', 'Ford'],
      ['2019', 10, 11, 12, 13],
      ['2020', 20, 11, 14, 13],
      ['2021', 30, 15, 12, 13],
    ],
    rowHeaders: true,
    colHeaders: true,
    height: 'auto',
    autoWrapRow: true,
    autoWrapCol: true,
    rowHeights: 23,
    colWidths: 100,
    manualColumnResize: true,
    licenseKey: 'non-commercial-and-evaluation', // for non-commercial use only
    nestedHeaders: [
      ['x', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
      ['N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W'],
    ],
    afterColumnResize(newSize, column, isDoubleClick) {
      console.log(newSize, column, isDoubleClick)
    },
  })
  hot.setDataAtCell(0, 3, 'new value')
})
</script>
<style lang="scss" scoped></style>
