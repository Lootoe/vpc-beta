import * as THREE from 'three'

export const createLights = (strength, distance) => {
  const light1 = new THREE.DirectionalLight(0xffffff, strength)
  light1.position.set(0, distance, 0)
  const light2 = new THREE.DirectionalLight(0xffffff, strength)
  light2.position.set(0, -distance, 0)
  const light3 = new THREE.DirectionalLight(0xffffff, strength)
  light3.position.set(0, 0, distance)
  const light4 = new THREE.DirectionalLight(0xffffff, strength)
  light4.position.set(0, 0, -distance)
  const light5 = new THREE.DirectionalLight(0xffffff, strength)
  light5.position.set(distance, 0, 0)
  const light6 = new THREE.DirectionalLight(0xffffff, strength)
  light6.position.set(-distance, 0, 0)

  return [light1, light2, light3, light4, light5, light6]
}

// 销毁材质
export const disposeMaterial = (material) => {
  if (material.map) {
    material.map.dispose()
  }
  if (material.lightMap) {
    material.lightMap.dispose()
  }
  if (material.bumpMap) {
    material.bumpMap.dispose()
  }
  if (material.normalMap) {
    material.normalMap.dispose()
  }
  if (material.specularMap) {
    material.specularMap.dispose()
  }
  if (material.envMap) {
    material.envMap.dispose()
  }
  material.dispose()
}

export const disposeObject = (object) => {
  if (object.geometry) {
    object.geometry.dispose()
  }

  if (object.material) {
    if (Array.isArray(object.material)) {
      object.material.forEach((material) => disposeMaterial(material))
    } else {
      disposeMaterial(object.material)
    }
  }

  if (object.texture) {
    object.texture.dispose()
  }

  if (object?.children?.length > 0) {
    object.children.forEach((child) => disposeObject(child))
  }
}
