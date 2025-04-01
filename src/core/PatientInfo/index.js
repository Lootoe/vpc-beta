import { convertAssets } from './convertAssets'
import { convertImplantInfo } from './convertImplantInfo'

export default class PatientInfo {
  static assets = []
  static implantInfo = {}
  static ready = false

  static init(apiResult) {
    this.assets = convertAssets(apiResult)
    this.implantInfo = convertImplantInfo(apiResult)
    this.ready = true
  }
}
