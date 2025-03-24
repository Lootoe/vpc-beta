<script setup>
import { getImageInfo } from '@/utils/api'
import { usePageLoading } from '@/components'
import { apiResultToPatient } from '@/core/convert/index'
const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()
onMounted(() => {
  loadBegin()
  getImageInfo()
    .then((res) => {
      const patient = apiResultToPatient(res)
      console.log(patient)
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
