import * as THREE from 'three'

/**生成发光Alpha贴图 */
const createEmissiveMap = (
  width = 400,
  height = 400,
  text = 'hello',
  fontSize = 80,
  bgColor = '#000000',
  textColor = '#ffffff'
) => {
  const canvas = document.createElement('canvas')
  canvas.width = width
  canvas.height = height
  const ctx = canvas.getContext('2d')
  ctx.fillStyle = bgColor
  ctx.fillRect(0, 0, width, height)
  ctx.beginPath()
  ctx.translate(0, height / 2)
  ctx.fillStyle = textColor
  const font = 'normal ' + fontSize + 'px' + ' sans-serif'
  ctx.font = font
  ctx.textAlign = 'center'
  ctx.textBaseline = 'middle'
  let textWidth = ctx.measureText(text).width
  ctx.fillText(text, width / 4 - textWidth / 2, 0)
  ctx.fillText(text, width * (3 / 4) - textWidth / 2, 0)
  return canvas
}

/**生成电极材质，带文字标注 */
const createChipMaterial = (width, height, text, fontSize, color) => {
  const texture = new THREE.CanvasTexture(createEmissiveMap(width, height, text, fontSize))
  return new THREE.MeshStandardMaterial({
    color: color,
    emissiveMap: texture,
    transparent: true,
    emissive: 0xffffff,
    side: THREE.FrontSide,
    metalness: 1,
    roughness: 0.6,
    depthTest: true,
  })
}

const createTransformMatrix = (startVector, endVector) => {
  const centerPoint = new THREE.Vector3().lerpVectors(startVector, endVector, 0.5)
  const transformMatrix = new THREE.Matrix4()
  // 平移到目标位置
  transformMatrix.makeTranslation(centerPoint.x, centerPoint.y, centerPoint.z)
  // 计算朝向
  const direction = new THREE.Vector3().subVectors(endVector, startVector).normalize()
  const up = new THREE.Vector3(0, 1, 0)

  // 计算电极片朝向的四元数
  const quaternion = new THREE.Quaternion().setFromUnitVectors(up, direction)
  quaternion.multiply(new THREE.Quaternion().setFromAxisAngle(up, Math.PI / 2))

  // 转换为旋转矩阵并组合
  const rotationMatrix = new THREE.Matrix4().makeRotationFromQuaternion(quaternion)
  transformMatrix.multiply(rotationMatrix)
  return transformMatrix
}

export const renderCircleChip = (lead) => {
  const vectors = lead.points.map((v) => new THREE.Vector3().fromArray(v))
  const leadBottomVector = vectors[0]
  const curve = new THREE.CatmullRomCurve3(vectors)
  const tangent = curve.getTangentAt(1) // 直线的方向向量

  const chipMeshes = []
  let startVector = new THREE.Vector3()
  let endVector = new THREE.Vector3()
  // 电极长度 = 切线向量 * 电极长度
  lead.chips.forEach((chip, index) => {
    const chipConfig = chip.chipConfig
    if (index === 0) {
      startVector = leadBottomVector.clone().addScaledVector(tangent, chipConfig.prevDistance)
      endVector = startVector.clone().addScaledVector(tangent, chipConfig.len)
    } else {
      startVector = endVector.clone().addScaledVector(tangent, chipConfig.prevDistance)
      endVector = startVector.clone().addScaledVector(tangent, chipConfig.len)
    }
    const transformMatrix = createTransformMatrix(startVector, endVector)
    // p1 p2线段沿着Y轴旋转成体
    const p1 = new THREE.Vector2(lead.leadConfig.radius + 0.02, -chipConfig.len / 2)
    const p2 = new THREE.Vector2(lead.leadConfig.radius + 0.02, chipConfig.len / 2)
    const geometry = new THREE.LatheGeometry([p1, p2], 36, 0, Math.PI * 2)
    geometry.applyMatrix4(transformMatrix)
    const mesh = new THREE.Mesh(
      geometry,
      createChipMaterial(400, 400 * (chipConfig.len / 3), chip.index, 60, chip.color)
    )
    mesh.name = 'chip'
    mesh.userData = {
      position: chip.position,
      index: chip.index,
    }
    chip.mesh = mesh
    chipMeshes.push(mesh)
  })
  return chipMeshes
}
