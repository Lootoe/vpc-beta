<script setup>
import { getImageInfo } from '@/utils/api'
import { usePageLoading } from '@/components'
import LeadManager from '@/core/lead'
import MainScene from '@/modules/scene/mainScene'
import PatientInfo from '@/core/PatientInfo'
import { renderLead } from '@/modules/lead/renderLead'

const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()

onMounted(() => {
  loadBegin()
  MainScene.init({
    selector: '.main-scene',
  })
  getImageInfo()
    .then((res) => {
      PatientInfo.init(res)
      const leadConfigs = PatientInfo.implantInfo.leads
      const isMultiIpg = PatientInfo.implantInfo.config?.isMultiIpg
      // 使用LeadManager初始化所有电极
      LeadManager.initLeads(leadConfigs, isMultiIpg).then(() => {
        console.log(LeadManager.getAllLeads())
        const leads = LeadManager.getAllLeads()
        leads.forEach((lead) => {
          const leadMesh = renderLead(lead)
          MainScene.addMesh(leadMesh)
        })
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
