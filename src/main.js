import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './style/index.less'
import App from './App.vue'
import './env'

const pinia = createPinia()
const app = createApp(App)

app.use(pinia)
app.use(router)
app.mount('#app')

console.log('SRENV', globalThis.SRENV)
