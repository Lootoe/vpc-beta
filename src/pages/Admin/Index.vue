<script setup>
import { getImageInfo } from '@/utils/api'
import { usePageLoading } from '@/components'
import { apiResultToPatient } from '@/core/convert'
import { LeadManager } from '@/core/lead'

const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()

onMounted(() => {
  loadBegin()
  getImageInfo()
    .then((res) => {
      const patient = apiResultToPatient(res)
      console.log(patient)

      const leadConfigs = patient.implantInfo.leads
      const isMultiIpg = patient.implantInfo.config?.isMultiIpg

      // 使用LeadManager初始化所有电极
      LeadManager.initLeads(leadConfigs, isMultiIpg)

      console.log(LeadManager.getAllLeads())
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
