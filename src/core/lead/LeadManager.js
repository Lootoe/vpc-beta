import { leadEnum } from './leadEnum'
import { Lead } from './leadStruct'

export class LeadManager {
  // 存储所有电极
  static leads = []
  // 存储所有已分配的芯片索引
  static indexMap = new Map()

  // 重置管理器
  static reset() {
    this.leads = []
    this.indexMap.clear()
  }

  // 初始化和管理所有电极
  static initLeads(leadConfigs, isMultiIpg) {
    this.reset()

    // 分配所有芯片的索引
    this.allocateIndices(leadConfigs, isMultiIpg)

    // 创建所有电极实例
    leadConfigs.forEach((leadConfig) => {
      const lead = new Lead({
        ...leadConfig,
      })
      this.leads.push(lead)
    })

    return this.leads
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

        // 为每个芯片分配索引
        for (let i = 0; i < leadInfo.number; i++) {
          const chipKey = `${position}-${i}`
          this.indexMap.set(chipKey, startIndex + i)
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

        // 为每个芯片分配索引
        for (let i = 0; i < leadInfo.number; i++) {
          const chipKey = `${position}-${i}`
          this.indexMap.set(chipKey, currentIndex)
          currentIndex++
        }
      })
    }
  }

  // 获取特定芯片的索引
  static getChipIndex(position, chipLocalIndex) {
    const key = `${position}-${chipLocalIndex}`
    return this.indexMap.has(key) ? this.indexMap.get(key) : 0
  }

  // 获取指定position的电极
  static getLead(position) {
    return this.leads.find((lead) => lead.position === position)
  }

  // 获取所有电极
  static getAllLeads() {
    return this.leads
  }

  // 获取特定类型的所有电极
  static getLeadsByType(type) {
    return this.leads.filter((lead) => lead.leadConfig.name === type)
  }
}
