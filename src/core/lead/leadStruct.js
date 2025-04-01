import { leadEnum } from './leadEnum'
import Chip from '@/core/chip'

export class Lead {
  leadType = ''
  leadConfig = {}
  chips = []
  position = 0

  constructor(params) {
    this.position = params.position
    this.leadType = params.leadType
    this.indexes = params.indexes
    this.initLeadConfig()
    this.initChips()
  }

  initLeadConfig() {
    if (!this.leadType) {
      throw new Error('电极型号不能为空')
    }
    const leadConfig = leadEnum.find((item) => item.name === this.leadType)
    this.leadConfig = leadConfig
  }

  initChips() {
    const leadConfig = this.leadConfig
    const chips = leadConfig.chipConfigs.map((item, i) => {
      const index = this.indexes[i]
      return new Chip(item, { position: this.position, index })
    })
    this.chips = chips
  }
}
