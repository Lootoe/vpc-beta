import { leadEnum } from './leadEnum'
import { loadLeadsFromTxt } from './loadLeadsFromTxt'
import { Lead } from './leadStruct'
import PatientInfo from '@/core/PatientInfo'

export default class LeadManager {
  // 存储所有电极
  static leads = []
  // 存储所有已分配的芯片索引，position对应数组
  static indexMap = {}

  // 重置管理器
  static _reset() {
    this._destory()
    this.leads = []
    this.indexMap = {}
  }

  static _destory() {
    if (this.leads.length > 0) {
      this.leads.forEach((lead) => {
        lead.destory()
      })
    }
  }

  // 分配电极片索引
  static _allocateIndices(leads, isMultiIpg) {
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

  // 根据已有的position去加载对应的电极
  static _loadLeads(leadConfigCount) {
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
      loadLeadsFromTxt(leadUrl.downloadUrl).then((leadTxtData) => {
        // 计算txt中的电极数量
        const leadTxtCount = Object.keys(leadTxtData).length
        if (leadTxtCount !== leadConfigCount) {
          reject('电极数量不匹配')
          return
        }
        resolve(leadTxtData)
      })
    })
  }

  // 初始化和管理所有电极
  static init() {
    return new Promise((resolve, reject) => {
      this._reset()
      const leadConfigs = PatientInfo.implantInfo?.leads
      const isMultiIpg = PatientInfo.implantInfo.config?.isMultiIpg
      const leadConfigCount = leadConfigs?.length ?? 0
      this._loadLeads(leadConfigCount)
        .then((leadTxtData) => {
          // 分配所有芯片的索引
          this._allocateIndices(leadConfigs, isMultiIpg)
          // 创建所有电极实例
          leadConfigs.forEach((leadConfig) => {
            const indexes = this.indexMap[leadConfig.position]
            const txtData = leadTxtData[leadConfig.position]
            const lead = new Lead({
              ...txtData,
              ...leadConfig,
              indexes,
            })
            this.leads.push(lead)
            resolve()
          })
        })
        .catch(reject)
    })
  }

  static render() {
    this.leads.forEach((lead) => {
      lead.render()
    })
  }

  // 获取指定position的电极
  static getLead(position) {
    return this.leads.find((lead) => lead.position === position)
  }

  // 获取所有电极
  static getAllLeads() {
    return this.leads
  }

  static getChip(position, index) {
    const lead = this.getLead(position)
    if (!lead) return null

    // 尝试在chips数组中找到对应index的芯片
    return lead.chips.find((chip) => chip.index === index) || null
  }
}
