import { createApp } from 'vue'
import App from './App.vue'
import { createPinia } from 'pinia'
import router from './router'
import { useAuthStore } from '@/stores/auth'
import { vuetify } from '@/plugins/vuetify'

const app = createApp(App);
const pinia = createPinia();
app.use(pinia);

const auth = useAuthStore();
auth.hydrate();

app.use(router);
app.use(vuetify);
app.mount('#app');
