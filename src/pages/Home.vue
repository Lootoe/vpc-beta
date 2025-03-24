<script setup>
import { usePageLoading } from '@/components'
const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()
import { onMounted } from 'vue'
defineOptions({
  name: 'Home',
})
onMounted(() => {
  loadBegin()
  setTimeout(() => {
    loadEnd()
  }, 2000)
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="less">
.center {
  height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  .info {
    margin: 8px 0;
  }
}
</style>
