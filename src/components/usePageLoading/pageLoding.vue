<script setup>
defineOptions({
  name: 'page-loading',
})

defineProps({
  tips: {
    type: String,
    default: 'loading',
  },
  opacity: {
    type: Number,
    default: 0.8,
  },
  loading: {
    type: Boolean,
    default: true,
  },
  failed: {
    type: Boolean,
    default: false,
  },
  failReason: {
    type: String,
    default: '请联系管理员',
  },
  progress: {
    type: Number,
    default: 0,
  },
})
</script>

<template>
  <div class="page-loading" v-show="loading">
    <div class="loading-mask" :style="{ opacity: opacity }"></div>
    <div class="locate">
      <template v-if="!failed">
        <div class="progress-container">
          <div class="progress-bar" :style="{ width: `${progress}%` }">
            <div class="pulse-effect"></div>
          </div>
          <div class="progress-text">{{ Math.floor(progress) }}%</div>
        </div>
        <div class="loading-text">{{ tips }}</div>
      </template>
      <template v-else>
        <div class="fail-reason-wrapper">
          <div class="fail-reason-img">
            <img src="@/assets/imgs/fail.png" alt="fail" />
          </div>
          <div class="fail-reason">
            <div class="fail-reason-title">加载失败</div>
            <div class="fail-reason-desc">{{ failReason }}</div>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<style scoped lang="less">
.page-loading {
  width: 100vw;
  height: 100vh;
  position: fixed;
  left: 0;
  top: 0;
  z-index: 9999;

  .loading-mask {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: #000;
  }

  .locate {
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
  }

  .progress-container {
    width: 4rem;
    background: rgba(255, 255, 255, 0.1);
    border-radius: 0.1rem;
    padding: 0.03rem;
    position: relative;
    box-shadow: 0 0 0.2rem rgba(0, 0, 0, 0.5);

    .progress-bar {
      height: 0.2rem;
      background: linear-gradient(90deg, #7766da, #ec4c24);
      border-radius: 0.1rem;
      transition: width 0.3s ease;
      position: relative;
      overflow: hidden;

      .pulse-effect {
        position: absolute;
        top: 0;
        left: 0;
        right: 0;
        bottom: 0;
        background: linear-gradient(
          90deg,
          rgba(255, 255, 255, 0) 0%,
          rgba(255, 255, 255, 0.5) 50%,
          rgba(255, 255, 255, 0) 100%
        );
        animation: pulse 1.5s ease-in-out infinite;
      }
    }

    .progress-text {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      color: #fff;
      font-size: 0.16rem;
      font-weight: bold;
      text-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.5);
    }
  }

  .loading-text {
    font-size: 0.2rem;
    color: #eee;
    margin-top: 0.24rem;
    text-shadow: 0 0 0.1rem rgba(0, 0, 0, 0.5);
    animation: breathing 1.5s ease-in-out infinite;
  }

  .fail-reason-wrapper {
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;

    .fail-reason-img {
      width: 1rem;
      height: 1rem;
      img {
        height: 100%;
        width: 100%;
      }
    }
    .fail-reason {
      margin-top: 0.24rem;
      .fail-reason-title {
        font-size: 0.24rem;
        text-align: center;
        color: #fff;
      }
      .fail-reason-desc {
        font-size: 0.2rem;
        text-align: center;
        margin-top: 0.12rem;
        max-width: 4.6rem;
        color: #ccc;
      }
    }
  }

  @keyframes pulse {
    0% {
      transform: translateX(-100%);
    }
    100% {
      transform: translateX(100%);
    }
  }

  @keyframes breathing {
    0%,
    100% {
      opacity: 1;
    }
    50% {
      opacity: 0.5;
    }
  }
}
</style>
