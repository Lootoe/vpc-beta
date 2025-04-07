import { leadEnum } from './leadEnum'
import Chip from '@/core/chip'
import { buildLead } from './buildLead'
import { buildCircleChip } from './buildCircleChip'
import MainScene from '@/core/scene'

export class Lead {
  leadType = ''
  leadConfig = {}
  chips = []
  position = 0
  points = []
  len = 0
  mesh = null

  constructor(params) {
    this.position = params.position
    this.leadType = params.leadType
    this.indexes = params.indexes
    this.points = params.points
    this.len = params.len
    this.initLead()
    this.initChips()
  }

  initLead() {
    if (!this.leadType) {
      throw new Error('电极型号不能为空')
    }
    const leadConfig = leadEnum.find((item) => item.name === this.leadType)
    this.leadConfig = leadConfig
    this.mesh = buildLead(this)
  }

  initChips() {
    const leadConfig = this.leadConfig
    const chips = leadConfig.chipConfigs.map((item, i) => {
      const index = this.indexes[i]
      return new Chip(item, { position: this.position, index })
    })
    this.chips = chips
    const chipMeshes = buildCircleChip(this)
    chipMeshes.forEach((mesh, i) => {
      chips[i].mesh = mesh
    })
  }

  render() {
    MainScene.addMesh(this.mesh)
    const chipMeshes = this.chips.map((v) => v.mesh)
    MainScene.addMesh(chipMeshes)
  }

  destory() {
    MainScene.removeMesh(this.mesh)
  }
}
