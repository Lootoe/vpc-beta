export class Chip {
  // 电极片状态，0：不带电，1：带正电，2：带负电
  state = 0
  // 电极片颜色
  color = 'rgba(0, 0, 0, 0)'
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
