import '@/assets/styles/base.css'
import '@/assets/styles/styles.scss'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import router from './router'
import './router/Interceptor'

import App from './App.vue'

const app = createApp(App)

app.use(createPinia())
app.use(router)
app.mount('#app')
