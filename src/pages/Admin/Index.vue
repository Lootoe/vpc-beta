<script setup>
import { getImageInfo } from '@/utils/api'
import { usePageLoading } from '@/components'
import LeadManager from '@/core/lead'
import MainScene from '@/core/scene'
import PatientInfo from '@/core/PatientInfo'
import watchRaycastEvent from '@/modules/racastEvent'

const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()

onMounted(() => {
  loadBegin()
  MainScene.init({
    selector: '.main-scene',
  })
  watchRaycastEvent()
  getImageInfo()
    .then((res) => {
      PatientInfo.init(res)
      // 使用LeadManager初始化所有电极
      LeadManager.init().then(() => {
        LeadManager.render()
        console.log(LeadManager.getAllLeads())
        loadUpdate({
          tips: '加载成功',
          delay: 500,
        }).then(() => {
          loadEnd()
        })
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
  <div class="main-scene"></div>
</template>

<style scoped lang="less">
.main-scene {
  width: 100vw;
  height: 100vh;
  background-color: #232a3b;
}
</style>
