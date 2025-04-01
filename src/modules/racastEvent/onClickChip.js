import LeadManager from '@/core/lead'

export const onClickChip = (params) => {
  if (!params.userData) return
  const { position, index } = params.userData
  const chip = LeadManager.getChip(position, index)
  chip.changeState()
}
