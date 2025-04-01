import { leadEnum } from './leadEnum'
import { loadLeadsFromTxt } from './loadLeadsFromTxt'
import PatientInfo from '@/core/PatientInfo'
import { Lead } from './leadStruct'

export default class LeadManager {
  // 存储所有电极
  static leads = []
  // 存储所有已分配的芯片索引，position对应数组
  static indexMap = {}

  // 重置管理器
  static reset() {
    this.leads = []
    this.indexMap = {}
  }

  // 初始化和管理所有电极
  static initLeads(leadConfigs, isMultiIpg) {
    this.reset()
    // 分配所有芯片的索引
    this.allocateIndices(leadConfigs, isMultiIpg)
    // 创建所有电极实例
    leadConfigs.forEach((leadConfig) => {
      const indexes = this.indexMap[leadConfig.position]
      const lead = new Lead({
        ...leadConfig,
        indexes,
      })
      this.leads.push(lead)
    })
    return this.loadLeads()
  }

  // 分配芯片索引 (原ChipIndexManager功能)
  static allocateIndices(leads, isMultiIpg) {
    if (isMultiIpg) {
      // 多IPG模式下的索引分配逻辑
      leads.forEach((leadConfig) => {
        const position = leadConfig.position
        const leadType = leadConfig.leadType
        const leadInfo = leadEnum.find((item) => item.name === leadType)
        if (!leadInfo) return

        const startIndex = position % 2 === 1 ? 0 : leadInfo.number

        // 初始化position对应的数组
        this.indexMap[position] = []

        // 为每个芯片分配索引
        for (let i = 0; i < leadInfo.number; i++) {
          this.indexMap[position][i] = startIndex + i
        }
      })
    } else {
      // 单IPG模式下的索引分配逻辑
      // 按照奇数优先、偶数次之的顺序排序
      const sortedLeads = [...leads].sort((a, b) => {
        if (a.position % 2 === 1 && b.position % 2 === 0) return -1
        if (a.position % 2 === 0 && b.position % 2 === 1) return 1
        return a.position - b.position
      })

      let currentIndex = 0
      sortedLeads.forEach((leadConfig) => {
        const position = leadConfig.position
        const leadType = leadConfig.leadType
        const leadInfo = leadEnum.find((item) => item.name === leadType)
        if (!leadInfo) return

        // 初始化position对应的数组
        this.indexMap[position] = []

        // 为每个芯片分配索引
        for (let i = 0; i < leadInfo.number; i++) {
          this.indexMap[position][i] = currentIndex
          currentIndex++
        }
      })
    }
  }

  // 获取指定position的电极
  static getLead(position) {
    return this.leads.find((lead) => lead.position === position)
  }

  // 获取所有电极
  static getAllLeads() {
    return this.leads
  }

  // 根据已有的position去加载对应的电极
  static loadLeads() {
    return new Promise((resolve, reject) => {
      if (!PatientInfo.ready) {
        reject('PatientInfo尚未初始化')
        return
      }
      const leadUrl = PatientInfo.assets['lead']
      if (!leadUrl) {
        reject('未找到电极文件')
        return
      }
      loadLeadsFromTxt(leadUrl.downloadUrl).then((leadVectors) => {
        // 计算txt中的电极数量
        const leadTxtCount = Object.keys(leadVectors).length
        const leadConfigCount = this.leads.length
        if (leadTxtCount !== leadConfigCount) {
          reject('电极数量不匹配')
          return
        }
        this.leads.forEach((lead) => {
          lead.points = leadVectors[lead.position].points
          lead.len = leadVectors[lead.position].len
        })
        resolve()
      })
    })
  }
}
