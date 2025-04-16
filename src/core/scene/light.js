import * as THREE from 'three'

export default function (strength) {
  // 主方向光 - 产生明确的阴影
  const mainLight = new THREE.DirectionalLight(0xffffff, strength)

  // 配置主光源的阴影 - 只让主要光源产生阴影以提高性能
  mainLight.castShadow = true

  // 确保平行光指向场景原点(0,0,0)
  mainLight.target.position.set(0, 0, 0)

  // 创建返回对象，包含灯光和更新函数
  const lights = {
    lightObjects: mainLight,

    // 根据相机位置更新光源位置的方法
    updateLightPosition: function (camera) {
      if (camera) {
        // 将光源位置设置为相机位置
        mainLight.position.copy(camera.position)
      }
    },
  }

  return lights
}
