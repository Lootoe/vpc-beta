// 可视化不需要左右通道，直接将PAD的数据结构改为可视化的数据结构
export const convertImplantInfo = (params) => {
  const { config, leftChannel, rightChannel } = params
  const implantInfo = {
    leads: [],
    config: {},
  }
  implantInfo.config = JSON.parse(config)
  leftChannel.implantList.forEach((obj) => {
    const { position } = obj
    implantInfo.leads.push({
      leadType: obj.lead,
      position,
    })
  })
  rightChannel.implantList.forEach((obj) => {
    const { position } = obj
    implantInfo.leads.push({
      leadType: obj.lead,
      position,
    })
  })
  return implantInfo
}
