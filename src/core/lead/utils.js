import { leadEnum } from './leadEnum'

// 计算索引函数
export const calcChipIndex = (leads, position, index, isMultiIpg) => {
  const currentLeadInfo = leads.find((v) => v.position === position)
  if (!currentLeadInfo) return 0
  const currentLeadConfig = leadEnum.find((v) => v.name === currentLeadInfo.leadType)
  if (!currentLeadConfig) return 0

  if (isMultiIpg === true) {
    // 基于position直接计算
    const startIndex = position % 2 === 1 ? 0 : currentLeadConfig.number
    return startIndex + index
  } else {
    // 基于leads和position计算起始索引
    // 先对leads按position排序
    const sortedLeads = [...leads].sort((a, b) => {
      // 按照奇数优先，偶数次之的顺序排序
      if (a.position % 2 === 1 && b.position % 2 === 0) return -1
      if (a.position % 2 === 0 && b.position % 2 === 1) return 1
      return a.position - b.position
    })

    // 计算当前position在排序后的位置
    const positionIndex = sortedLeads.findIndex((lead) => lead.position === position)
    if (positionIndex === -1) return 0

    // 计算之前所有lead的节点总数
    let startIndex = 0
    for (let i = 0; i < positionIndex; i++) {
      const leadConfig = leadEnum.find((item) => item.name === sortedLeads[i].leadType)
      if (leadConfig) {
        startIndex += leadConfig.number
      }
    }

    return startIndex + index
  }
}
