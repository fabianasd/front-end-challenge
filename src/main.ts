import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './routes/students'
import { vuetify } from './plugins/vuetify'

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
