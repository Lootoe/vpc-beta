import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/Addons.js'
import { computeBoundsTree, disposeBoundsTree, acceleratedRaycast } from 'three-mesh-bvh'
import { createLights, disposeObject } from './mainSceneUtils'

// 加速射线检测的重中之重
THREE.BufferGeometry.prototype.computeBoundsTree = computeBoundsTree
THREE.BufferGeometry.prototype.disposeBoundsTree = disposeBoundsTree
THREE.Mesh.prototype.raycast = acceleratedRaycast

const defaultSceneConfig = {
  /**相机可视距离 */
  cameraFar: 1000,
  /** 镜头距离原点距离 */
  screenDistance: 80,
  /** 控制器的缩放距离限制 */
  zoomLimit: [1, 500],
  /**环境光的强度 */
  ambientStrength: 1,
  /** 背景色 */
  backgroundColor: 0x000000,
}

export default class MainScene {
  static dom = null
  static renderer = null
  static camera = null
  static controls = null
  static scene = null
  static lights = null
  static config = null

  static init(options) {
    this.config = { ...defaultSceneConfig, ...options }
    //————渲染器————
    this.dom = document.querySelector(this.config.selector)
    const width = this.dom.clientWidth
    const height = this.dom.clientHeight
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
      depth: true,
    })
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(width / height)
    this.dom.appendChild(this.renderer.domElement)
    this.scene = new THREE.Scene()
    //————相机————
    this.camera = new THREE.PerspectiveCamera(75, width / height, 1, this.config.cameraFar)
    this.camera.lookAt(new THREE.Vector3(0, 0, 0))
    this.camera.position.set(0, 0, this.config.screenDistance)
    this.scene.add(this.camera)
    //————控制器————
    this.controls = new OrbitControls(this.camera, this.renderer.domElement)
    this.controls.minDistance = this.config.zoomLimit[0]
    this.controls.maxDistance = this.config.zoomLimit[1]
    // 解决万向锁
    this.controls.maxPolarAngle = Math.PI * (170 / 180)
    this.controls.minPolarAngle = Math.PI * (10 / 180)
    //————环境光————
    const ambientLight = new THREE.AmbientLight(0xffffff, this.config.ambientStrength)
    this.scene.add(ambientLight)
    //————灯光————
    const lights = createLights(4, 500)
    lights.forEach((light) => {
      this.scene.add(light)
    })
    //————动画————
    const renderLoop = () => {
      this.controls.update()
      this.renderer.autoClear = false
      this.renderer.clear()
      this.renderer.render(this.scene, this.camera)
      requestAnimationFrame(renderLoop)
    }
    renderLoop()
    // ————window resize————
    window.addEventListener('resize', this.renderResize)
  }

  static renderResize() {
    const width = this.dom.clientWidth
    const height = this.dom.clientHeight
    this.renderer.setSize(width, height)
    this.renderer.setPixelRatio(width / height)
    this.camera.aspect = width / height
    this.camera.updateProjectionMatrix()
  }

  static destory() {
    // 移除事件监听
    window.removeEventListener('resize', this.renderResize)
    // 销毁场景中的所有对象
    if (this.scene) {
      while (this.scene.children.length > 0) {
        const object = this.scene.children[0]
        this.scene.remove(object)
        disposeObject(object)
      }
    }
    // 销毁控制器
    if (this.controls) {
      this.controls.dispose()
      this.controls = null
    }
    // 销毁渲染器
    if (this.renderer) {
      this.renderer.dispose()
      this.renderer.forceContextLoss()
      this.renderer.domElement.remove()
      this.renderer = null
    }
    // 清空引用
    this.camera = null
    this.scene = null
    this.dom = null
    this.config = null
    this.lights = null
    this.controls = null
    this.renderer = null
  }

  static addMesh(mesh) {
    if (!mesh) return
    if (Array.isArray(mesh)) {
      mesh.forEach((item) => {
        this.scene.add(item)
      })
    } else {
      this.scene.add(mesh)
    }
  }

  static removeMesh(mesh) {
    if (!mesh) return
    if (Array.isArray(mesh)) {
      mesh.forEach((item) => {
        if (item.isMesh) {
          disposeObject(item)
          this.scene.remove(item)
        }
      })
    } else {
      disposeObject(mesh)
      this.scene.remove(mesh)
    }
  }
}
