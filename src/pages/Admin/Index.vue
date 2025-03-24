<script setup>
import { getImageInfo } from '@/utils/api'
import { onMounted } from 'vue'
import { usePageLoading } from '@/components'
const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()
onMounted(() => {
  loadBegin()
  getImageInfo()
    .then((res) => {
      loadUpdate({
        tips: '加载成功',
        delay: 500,
      }).then(() => {
        loadEnd()
      })
      console.log(res)
    })
    .catch((err) => {
      loadFail()
      console.log(err)
    })
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="less"></style>
