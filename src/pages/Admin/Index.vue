<script setup>
import { getImageInfo } from '@/utils/api'
import LeadManager from '@/core/lead'
import MainScene from '@/core/scene'
import PatientInfo from '@/core/PatientInfo'
import watchRaycastEvent from '@/modules/racastEvent'
import AssetManager from '@/coreNew/AssetManager'

onMounted(() => {
  MainScene.init({
    selector: '.main-scene',
  })
  AssetManager.fetchAssetList(() => {
    return getImageInfo()
  }).then(() => {
    AssetManager.downloadAsset()
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
