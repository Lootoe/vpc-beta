import * as THREE from 'three'
import { renderPole } from './renderPole'
import { renderCircleChip } from './renderCircleChip'

const adjustCurveMatrix = (leadPoints, leadLen) => {
  const leadVectors = leadPoints.map((v) => new THREE.Vector3().fromArray(v))
  const curve = new THREE.CatmullRomCurve3(leadVectors)
  const tangent = curve.getTangentAt(1) // 直线的方向向量
  const endPoint = curve.getPointAt(0)
  const bottomPoint = endPoint.clone()
  // 电极长度 = 切线向量 * 电极长度
  const topPoint = bottomPoint.clone().addScaledVector(tangent, leadLen)
  return [bottomPoint, topPoint]
}

export const renderLead = (lead) => {
  const { points, len } = lead
  const lead2Points = adjustCurveMatrix(points, len)

  const pole = renderPole(lead2Points, lead.leadConfig.radius)
  const chips = renderCircleChip(lead)

  // 组合成组
  const group = new THREE.Group()
  group.add(pole, ...chips)

  return group
}
