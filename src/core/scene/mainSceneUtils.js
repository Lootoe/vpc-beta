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
