import { createApp } from 'vue'
import App from './app.vue'
import { patchConsole } from './components/console'

patchConsole()
createApp(App).mount('#app')