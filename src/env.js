const mode = import.meta.env.VITE_MODE
const platform = import.meta.env.VITE_PLATFORM

const MODE_TYPE = {
  DEV: 'dev',
  TEST: 'test',
  PROD: 'prod',
}

const PLATFORM_TYPE = {
  DEBUG: 'debug',
  PC: 'pc',
  PAD: 'pad',
}

const ENV = {
  MODE: mode,
  PLATFORM: platform,
  MODE_TYPE,
  PLATFORM_TYPE,
  IS_MODE_DEV: () => ENV.MODE === ENV.MODE_TYPE.DEV,
  IS_MODE_TEST: () => ENV.MODE === ENV.MODE_TYPE.TEST,
  IS_MODE_PROD: () => ENV.MODE === ENV.MODE_TYPE.PROD,
  IS_PLATFORM_DEBUG: () => ENV.PLATFORM === ENV.PLATFORM_TYPE.DEBUG,
  IS_PLATFORM_PC: () => ENV.PLATFORM === ENV.PLATFORM_TYPE.PC,
  IS_PLATFORM_PAD: () => ENV.PLATFORM === ENV.PLATFORM_TYPE.PAD,
}

globalThis.ENV = ENV
