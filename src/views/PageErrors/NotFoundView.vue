<template>
  <div class="box flex justify-center items-center overflow-hidden">
    <div ref="refWrapper" class="p-16 flex justify-center rounded wrapper">
      <img class="block" src="../../assets/images/not-found.gif" alt="" />
    </div>
  </div>
</template>
<script setup lang="ts"></script>
<style lang="scss" scoped>
$color1: #b8dee1;
$color2: #fefefe;
.wrapper {
  box-shadow: 0 0 20px 2px rgba(#000, 0.1);
  background: linear-gradient(rgba($color2, 0.5), rgba($color1, 0.5));
  // backdrop-filter: blur(8px);
}
.box {
  min-height: 100vh;
  background: linear-gradient($color1, $color2);
}
</style>
