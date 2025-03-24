import { convertAssets } from './convertAssets'
import { convertImplantInfo } from './convertImplantInfo'

export const apiResultToPatient = (apiResult) => {
  const asssets = convertAssets(apiResult)
  const implantInfo = convertImplantInfo(apiResult)
  const patient = {
    asssets,
    implantInfo,
  }
  return patient
}
