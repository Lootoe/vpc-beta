export const convertAssets = (params) => {
  if (!params) {
    throw new Error('接口数据为空，请检查参数是否正确')
  }
  let sourceData
  if (params.modalityResultList) {
    sourceData = params.modalityResultList
  }
  if (params.assetsList) {
    sourceData = params.assetsList
  }
  const assets = {}
  const handlerMap = {
    nucleus: nucleusHandler,
    lead: leadHandler,
    fiber: fiberHandler,
    matrix: matrixHandler,
    head: headHandler,
    filter: filterHandler,
    VTA: vtaHandler,
    file: fileHandler,
  }
  sourceData.forEach((item) => {
    const { type } = item
    assets[type] = handlerMap[type](item)
  })
  return assets
}

const nucleusHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    return item.downloadUrlList.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
  } else {
    return item.downloadUrlList
  }
}

const leadHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    const reg = new RegExp('Lead.txt')
    const lead = item.downloadUrlList.find((v) => {
      return reg.test(v)
    })
    return {
      downloadUrl: lead,
      fileName: lead,
    }
  } else {
    const reg = new RegExp('Lead.txt')
    const lead = item.downloadUrlList.find((v) => {
      return reg.test(v.fileName)
    })
    return lead
  }
}

const fiberHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    const fibers = item.downloadUrlList.filter((v) => {
      return v.search('whole_brain') !== -1
    })
    const wholeBrainFibers = item.downloadUrlList.filter((v) => {
      return v.search('head_mask') !== -1
    })

    const fiber = fibers.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
    const wholeBrainFiber = wholeBrainFibers.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
    return {
      fiber,
      wholeBrainFiber,
    }
  } else {
    const fiber = item.downloadUrlList.filter((v) => {
      return v.fileName.search('whole_brain') !== -1
    })
    const wholeBrainFiber = item.downloadUrlList.filter((v) => {
      return v.fileName.search('head_mask') !== -1
    })
    return {
      fiber,
      wholeBrainFiber,
    }
  }
}

const matrixHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    const str1 = 'MNI152_template'
    const templateAffine = item.downloadUrlList.find((v) => {
      return v.search(str1) !== -1
    })
    return {
      downloadUrl: templateAffine,
      fileName: templateAffine,
    }
  } else {
    const str1 = 'MNI152_template'
    const templateAffine = item.downloadUrlList.find((v) => {
      return v.fileName.search(str1) !== -1
    })
    return templateAffine
  }
}

const headHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    if (item.downloadUrlList.length > 0) {
      return {
        downloadUrl: item.downloadUrlList[0],
        fileName: item.downloadUrlList[0],
      }
    }
  } else {
    return item.downloadUrlList[0]
  }
}

const filterHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    return item.downloadUrlList.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
  } else {
    return item.downloadUrlList
  }
}

const vtaHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    return item.downloadUrlList.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
  } else {
    return item.downloadUrlList
  }
}

const fileHandler = (item) => {
  if (globalThis.SRENV.IS_PLATFORM_PAD()) {
    return item.downloadUrlList.map((v) => {
      return {
        downloadUrl: v,
        fileName: v,
      }
    })
  } else {
    return item.downloadUrlList
  }
}
