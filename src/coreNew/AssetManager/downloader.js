import * as THREE from 'three'
import { AssetType } from './type'
import { PLYLoader } from 'three/examples/jsm/loaders/PLYLoader'

const loadFile = (url) => {
  return new Promise((resolve, reject) => {
    const fileloadr = new THREE.FileLoader()
    fileloadr.load(
      url,
      (data) => {
        resolve(data)
      },
      null,
      reject
    )
  })
}

// ————必须优先下载的内容————
export const downloadMatrix = (url) => {
  return new Promise((resolve, reject) => {
    loadFile(url)
      .then((data) => {
        const reg = /\s/g
        let arr = data.split(reg)
        arr = arr.filter((v) => !!v && v !== '')
        // 去除末尾的空字符串
        const affine = new THREE.Matrix4()
        const numbers = arr.map((v) => Number(v))
        affine.set(...numbers)
        resolve(affine)
      })
      .catch(() => {
        reject('标准模板矩阵下载失败')
      })
  })
}

export const downloadLead = (url) => {
  const leads = {}
  return new Promise((resolve, reject) => {
    loadFile(url)
      .then((data) => {
        // 按行分割并过滤空行
        const lines = data.split('\n').filter((line) => line.trim())

        // 定义正则表达式
        const positionRegex = /\[(\w)\]/
        const lengthRegex = /\[len_(\d{1})\]/

        // 一次遍历处理所有数据
        lines.forEach((line) => {
          // 处理电极位置
          const positionMatch = line.match(positionRegex)
          if (positionMatch) {
            const position = Number(positionMatch[1])
            // 提取坐标
            const coordinatesText = line.split(positionRegex)[2]
            const coordinates = coordinatesText.split(',').map(Number)
            // 创建三维向量
            const point = [coordinates[0], coordinates[1], coordinates[2]]
            // 获取或创建电极对象
            if (!leads[position]) {
              leads[position] = {
                position,
                points: [point],
                len: 60, // 默认长度
              }
            } else {
              leads[position].points.push(point)
            }
            return
          }
          // 处理电极长度
          const lengthMatch = line.match(lengthRegex)
          if (lengthMatch) {
            const position = Number(lengthMatch[1])
            const length = Number(line.split(lengthRegex)[2])
            // 确保该位置的电极已存在
            if (leads[position]) {
              leads[position].len = length
            }
          }
        })
        resolve(leads)
      })
      .catch((error) => {
        console.error('加载电极数据失败:', error)
        reject(error)
      })
  })
}

export const downloadNucleus = (urlList) => {
  const requests = []
  urlList.forEach((obj) => {
    const loader = new PLYLoader()
    const promise = new Promise((resolve) => {
      loader.load(obj.downloadUrl, (geometry) => {
        resolve({ geometry, fileName: obj.fileName })
      })
    })
    requests.push(promise)
  })
  return Promise.all(requests).then((result) => {
    return result
  })
}

// ————进入后下载的内容————
export const downloadFiber = (urlList) => {
  const requests = []
  urlList.forEach((obj) => {
    const promise = new Promise((resolve) => {
      loadFile(obj.downloadUrl).then((data) => {
        resolve(data)
      })
    })
    requests.push(promise)
  })
  return Promise.all(requests).then((result) => {
    return result
  })
}

export const downloadWholeBrainFiber = (assetList) => {
  const requests = []
  const urlList = assetList[AssetType.FIBER]?.wholeBrainFiber
  if (urlList && urlList.length > 0) {
    urlList.forEach((obj) => {
      const promise = new Promise((resolve) => {
        loadFile(obj.downloadUrl).then((data) => {
          resolve(data)
        })
      })
      requests.push(promise)
    })
    return Promise.all(requests).then((result) => {
      return result
    })
  } else {
    return Promise.resolve()
  }
}

export const downloadFilter = (urlList) => {
  const requests = []
  urlList.forEach((obj) => {
    const loader = new PLYLoader()
    const promise = new Promise((resolve) => {
      loader.load(obj.downloadUrl, (geometry) => {
        resolve({ geometry, fileName: obj.fileName })
      })
    })
    requests.push(promise)
  })
  return Promise.all(requests).then((result) => {
    return result
  })
}

export const downloadCortex = (url) => {
  const loader = new PLYLoader()
  return new Promise((resolve) => {
    loader.load(url, (geometry) => {
      resolve(geometry)
    })
  })
}
