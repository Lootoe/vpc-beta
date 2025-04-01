import * as THREE from 'three'
import MainScene from '@/modules/scene'
import { onClickChip } from './onClickChip'

export default () => {
  // 获取 DOM
  const dom = document.querySelector(MainScene.selector)
  const rect = dom.getBoundingClientRect()
  dom.addEventListener('click', (event) => {
    // 监听点击事件
    const raycaster = new THREE.Raycaster()
    const mouse = new THREE.Vector2()
    // 计算鼠标或触摸点的位置
    mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1
    mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1
    // 更新射线
    raycaster.setFromCamera(mouse, MainScene.camera)
    // 计算与所有对象的交点
    // 处理点击事件
    // 目前只有电极片的点击事件
    const intersects = raycaster.intersectObjects(MainScene.scene.children)
    if (intersects.length > 0) {
      console.log('intersects', intersects)
      intersects.forEach((item) => {
        const mesh = item.object
        if (mesh?.name === 'chip') {
          onClickChip(mesh)
        }
      })
    }
  })
}
