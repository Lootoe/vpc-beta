import { CHIP_TYPE, ELECTRODE_TYPE, ELECTRODE_COLOR } from './type'
import * as THREE from 'three'

export default class Chip {
  CHIP_TYPE = CHIP_TYPE
  ELECTRODE_TYPE = ELECTRODE_TYPE
  ELECTRODE_COLOR = ELECTRODE_COLOR
  // 电极片状态，0：不带电，1：带正电，2：带负电
  state = ELECTRODE_TYPE.COMMON
  // 电极片颜色
  color = ELECTRODE_COLOR[ELECTRODE_TYPE.COMMON]
  // 电极片位置
  position = 0
  // 电极片编号
  index = 0
  chipConfig = {}
  mesh = null

  constructor(config, options) {
    this.chipConfig = config
    this.position = options.position
    this.index = options.index
  }

  changeState() {
    // 循环切换电极片状态：不带电 -> 带正电 -> 带负电 -> 不带电
    switch (this.state) {
      case ELECTRODE_TYPE.COMMON:
        this.state = ELECTRODE_TYPE.POSITIVE
        break
      case ELECTRODE_TYPE.POSITIVE:
        this.state = ELECTRODE_TYPE.NEGATIVE
        break
      case ELECTRODE_TYPE.NEGATIVE:
        this.state = ELECTRODE_TYPE.COMMON
        break
      default:
        this.state = ELECTRODE_TYPE.COMMON
    }

    // 更新电极片颜色
    this.color = ELECTRODE_COLOR[this.state]
    if (this.mesh) {
      this.mesh.material.color = new THREE.Color(this.color)
    }
  }
}
