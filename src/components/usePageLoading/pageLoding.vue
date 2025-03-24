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
    default: 1,
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
})
</script>

<template>
  <div class="page-loading" v-show="loading">
    <div class="loading-mask" :style="{ opacity: opacity }"></div>
    <div class="locate">
      <template v-if="!failed">
        <div class="spinner-wrapper">
          <div class="spinner"></div>
          <div class="spinner-text">loading</div>
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
  .loading-text {
    font-size: 0.2rem;
    color: #eee;
    margin-top: 0.24rem;
  }
  .spinner-wrapper {
    width: 1rem;
    height: 1rem;
    display: flex;
    justify-content: center;
    align-items: center;
    position: relative;

    .spinner {
      position: absolute;
      width: 100%;
      height: 100%;
      border-radius: 50%;
      border: 0.04rem solid transparent;
      border-top-color: #7766da;
      border-bottom-color: #ec4c24;
      animation: spinner 0.6s ease infinite;
    }

    .spinner-text {
      position: absolute;
      width: 100%;
      height: 100%;
      display: flex;
      justify-content: center;
      align-items: center;
      color: #fff;
      font-size: 0.16rem;
      font-weight: bold;
      letter-spacing: 0.01rem;
      animation: breathing 1.5s ease-in-out infinite;
    }
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

  @keyframes spinner {
    to {
      transform: rotate(360deg);
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
