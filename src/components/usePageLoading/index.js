import { reactive, createApp, h } from 'vue'
import PageLodingComponent from './pageLoding.vue'

const root = document.createElement('div')
root.setAttribute('class', 'page-loading-cover')
document.body.appendChild(root)

// 创建一个应用实例
let app = null

export function usePageLoading() {
  const initialState = {
    tips: '加载中',
    opacity: 1,
    loading: false,
    failed: false,
    failReason: '',
  }

  const state = reactive({ ...initialState })

  const resetState = () => {
    Object.assign(state, initialState)
  }

  // 初始化应用实例
  const initApp = () => {
    if (!app) {
      app = createApp({
        render() {
          return h(PageLodingComponent, {
            tips: state.tips,
            opacity: state.opacity,
            loading: state.loading,
            failed: state.failed,
            failReason: state.failReason,
          })
        },
      })
      app.mount(root)
    }
  }

  /**
   *
   * @param {Object} config Loading配置
   * @param {Object} config.tips Loading文案
   * @param {Number} config.opacity 背景透明度
   * @param {Number} config.delay 延迟多久后执行.then后续的逻辑
   * @returns Promise
   */
  const loadBegin = (config) => {
    return new Promise((resolve) => {
      resetState()
      state.loading = true
      if (config?.tips) state.tips = config.tips
      if (config?.opacity) state.opacity = config.opacity

      // 初始化应用实例，之后状态变化会自动触发更新
      initApp()

      if (config?.delay) {
        setTimeout(() => {
          resolve()
        }, config.delay)
      } else {
        resolve()
      }
    })
  }

  /**
   *
   * @param {Object} config Loading配置
   * @param {Object} config.tips Loading文案
   * @param {Number} config.opacity 背景透明度
   * @param {Number} config.delay 延迟多久后执行.then后续的逻辑
   * @returns Promise
   */
  const loadUpdate = (config) => {
    return new Promise((resolve) => {
      if (config?.tips) state.tips = config.tips
      if (config?.opacity) state.opacity = config.opacity

      // 由于使用了响应式状态，这里不需要手动重新渲染

      if (config?.delay) {
        setTimeout(() => {
          resolve()
        }, config.delay)
      } else {
        resolve()
      }
    })
  }

  /**
   *
   * @param {Object} config Loading配置
   * @param {Object} config.tips Loading文案
   * @param {Number} config.opacity 背景透明度
   * @param {Number} config.delay 延迟多久后执行.then后续的逻辑
   * @returns Promise
   */
  const loadEnd = (config) => {
    return new Promise((resolve) => {
      if (config?.tips) state.tips = config.tips
      if (config?.opacity) state.opacity = config.opacity

      if (config?.delay) {
        setTimeout(() => {
          state.loading = false
          // 如果需要卸载应用
          app?.unmount()
          app = null
          resolve()
        }, config.delay)
      } else {
        state.loading = false
        // 如果需要卸载应用
        app?.unmount()
        app = null
        resolve()
      }
    })
  }

  /**
   *
   * @param {string} reason 加载失败的提示
   */
  const loadFail = (config) => {
    state.failed = true
    if (config?.failReason) state.failReason = config.failReason
  }

  return { loadBegin, loadUpdate, loadEnd, loadFail }
}
