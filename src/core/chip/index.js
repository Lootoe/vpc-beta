import { CHIP_TYPE, ELECTRODE_TYPE, ELECTRODE_COLOR } from './type'

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

  constructor(config, options) {
    this.chipConfig = config
    this.position = options.position
    this.index = options.index
  }
}
