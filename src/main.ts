import { createApp } from 'vue'
import { createPinia } from 'pinia'
import { MotionPlugin } from '@vueuse/motion'
import App from './App.vue'
import router from './router/index'
import './assets/styles.css'

createApp(App)
  .use(createPinia())
  .use(router)
  .use(MotionPlugin)
  .mount('#app')
