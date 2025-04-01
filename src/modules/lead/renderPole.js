import * as THREE from 'three'

const createPoleMaterial = () => {
  return new THREE.MeshLambertMaterial({
    color: 0xffffff,
    opacity: 0.6,
    transparent: true,
    side: THREE.DoubleSide,
    depthTest: true,
  })
}

const renderCylinder = (leadCurvePoints, radius = 1.27 / 2) => {
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)

  // 创建扫描形状
  const circle = new THREE.EllipseCurve(0, 0, radius, radius, 0, Math.PI * 2, true)
  const shape = new THREE.Shape(circle.getPoints(128))

  // 扫描成型
  return new THREE.ExtrudeGeometry(shape, {
    extrudePath: curve,
    steps: 12,
  })
}

const renderHalfBall = (leadCurvePoints, radius = 1.27 / 2) => {
  const curve = new THREE.CatmullRomCurve3(leadCurvePoints)
  const startPoint = curve.getPointAt(0)
  const tangent = curve.getTangentAt(0)

  // 创建球体几何体
  const ball = new THREE.SphereGeometry(radius, 32, 32, 0, Math.PI, 0, Math.PI)

  // 应用变换
  const matrix = new THREE.Matrix4()
  matrix.lookAt(startPoint, startPoint.clone().add(tangent), new THREE.Vector3(0, 1, 0))
  ball.applyMatrix4(matrix)
  ball.translate(startPoint.x, startPoint.y, startPoint.z)

  return ball
}

export const renderPole = (leadCurvePoints, radius = 1.27 / 2) => {
  const cylinder = renderCylinder(leadCurvePoints, radius)
  const halfBall = renderHalfBall(leadCurvePoints, radius)
  const cylinderMesh = new THREE.Mesh(cylinder, createPoleMaterial())
  const halfBallMesh = new THREE.Mesh(halfBall, createPoleMaterial())
  const group = new THREE.Group()
  group.add(cylinderMesh, halfBallMesh)
  return group
}
