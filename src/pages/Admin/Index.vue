<script setup>
import { getImageInfo } from '@/utils/api'
import { usePageLoading } from '@/components'
import { convertAssets } from '@/core/convert/convertAssets'
const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()
onMounted(() => {
  loadBegin()
  getImageInfo()
    .then((res) => {
      console.log(res)
      const assets = convertAssets(res.modalityResultList)
      console.log(assets)
      loadUpdate({
        tips: '加载成功',
        delay: 500,
      }).then(() => {
        loadEnd()
      })
    })
    .catch((err) => {
      console.error('err', err)
      loadFail({
        failReason: err.message,
      })
    })
})
</script>

<template>
  <div></div>
</template>

<style scoped lang="less"></style>
