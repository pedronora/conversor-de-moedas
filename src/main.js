import { createApp } from 'vue'
import App from './App.vue'
import { inject } from '@vercel/analytics'

import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap'
import 'bootstrap-icons/font/bootstrap-icons.css'

const app = createApp(App)

inject()

app.mount('#app')
