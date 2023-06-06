

<template>
  <div style="width: 300px; height: 600px">
    <WechatScan ref="scan"></WechatScan>
    <div @click="onOpen">打开</div>
    <div @click="onClose">关闭</div>
  </div>
</template>
<script setup lang="ts">
  import { ref } from 'vue'
  import { WechatScan } from '../packages'

  const scan = ref(null)

  const onOpen = () => {
    console.log('dass')
    scan.value.openScan()
  }

  const onClose=()=>{
    scan.value.closeScan()
  }
  
</script>
<style scoped>
  .logo {
    height: 6em;
    padding: 1.5em;
    will-change: filter;
    transition: filter 300ms;
  }
  .logo:hover {
    filter: drop-shadow(0 0 2em #646cffaa);
  }
  .logo.vue:hover {
    filter: drop-shadow(0 0 2em #42b883aa);
  }
</style>
