import { convertAssets } from './convertAssets'
import { convertImplantInfo } from './convertImplantInfo'
import { AssetType } from './type'
import * as downloader from './downloader'
import { usePageLoading } from '@/components'

const { loadBegin, loadUpdate, loadEnd, loadFail } = usePageLoading()

export default class AssetManager {
  // 需要下载的文件地址
  static assetUrlList = {}
  // 下载完成的文件内容
  static assetContent = {}
  static patientInfo = {}
  constructor() {}

  // FN可能是一个接口，也可能是与其他设备的通信
  static fetchAssetList(fn) {
    loadBegin({
      tips: '正在获取下载资源',
      progress: 10,
    })
    return new Promise((resolve, reject) => {
      fn()
        .then((res) => {
          this.assetUrlList = convertAssets(res)
          console.log('【资源列表】', this.assetUrlList)
          this.patientInfo = convertImplantInfo(res)
          console.log('【患者详情】', this.patientInfo)
          resolve()
        })
        .catch(() => {
          reject('获取资源失败')
        })
    })
  }

  static async downloadAsset() {
    // ————必须优先下载的内容————
    const matrixUrl = this.assetUrlList[AssetType.MATRIX]?.downloadUrl
    if (!matrixUrl) {
      loadFail({
        tips: '不存在标准模板矩阵的下载地址',
        progress: 0,
      })
      return
    }
    loadUpdate({
      tips: '正在加载标准模板矩阵',
      progress: 20,
    })
    const matrix = await downloader.downloadMatrix(matrixUrl)
    this.assetContent[AssetType.MATRIX] = matrix
    // -----------
    const leadUrl = this.assetUrlList[AssetType.LEAD]?.downloadUrl
    if (!leadUrl) {
      loadFail({
        tips: '不存在电极的下载地址',
        progress: 0,
      })
      return
    }
    loadUpdate({
      tips: '正在加载电极',
      progress: 40,
    })
    const lead = await downloader.downloadLead(leadUrl)
    this.assetContent[AssetType.LEAD] = lead
    // -----------
    const nuleusUrlList = this.assetUrlList[AssetType.NUCLEUS]
    if (!nuleusUrlList || nuleusUrlList.length === 0) {
      loadFail({
        tips: '不存在核团的下载地址',
        progress: 0,
      })
      return
    }
    loadUpdate({
      tips: '正在加载核团',
      progress: 60,
    })
    const nuleusList = await downloader.downloadNucleus(nuleusUrlList)
    this.assetContent[AssetType.NUCLEUS] = nuleusList
    // -----------
    const fiberUrlList = this.assetUrlList[AssetType.FIBER]?.fiber
    if (fiberUrlList && fiberUrlList.length > 0) {
      loadUpdate({
        tips: '正在加载神经纤维',
        progress: 80,
      })
      const fiber = await downloader.downloadFiber(fiberUrlList)
      this.assetContent[AssetType.FIBER] = fiber
    } else {
      console.warn('不存在神经纤维的下载地址')
    }
    // -----------
    const filterUrlList = this.assetUrlList[AssetType.FILTER]
    if (filterUrlList && filterUrlList.length > 0) {
      const filter = await downloader.downloadFilter(filterUrlList)
      this.assetContent[AssetType.FILTER] = filter
    } else {
      console.warn('不存在过滤器的下载地址')
    }
    // -----------
    loadUpdate({
      tips: '加载成功',
      delay: 300,
      progress: 100,
    }).then(() => {
      loadEnd()
    })
    // ————进入后下载的内容————
    const cortexUrl = this.assetUrlList[AssetType.CORTEX]?.downloadUrl
    if (cortexUrl) {
      const head = await downloader.downloadCortex(cortexUrl)
      this.assetContent[AssetType.CORTEX] = head
    } else {
      console.warn('不存在大脑皮层的下载地址')
    }
    // -----------
    const wholeBrainFiberUrl = this.assetUrlList[AssetType.FIBER]?.wholeBrainFiber
    if (wholeBrainFiberUrl && wholeBrainFiberUrl.length > 0) {
      const wholeBrainFiber = await downloader.downloadWholeBrainFiber(wholeBrainFiberUrl)
      this.assetContent[AssetType.WHOLE_BRAIN_FIBER] = wholeBrainFiber
    } else {
      console.warn('不存在全脑神经纤维的下载地址')
    }
  }
}
