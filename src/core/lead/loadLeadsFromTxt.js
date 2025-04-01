import * as THREE from 'three'

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

export const loadLeadsFromTxt = (url) => {
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
