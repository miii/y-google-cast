import { createApp } from 'vue'
import App from './App.vue'
import { patchConsole } from './components/console'

patchConsole()
createApp(App).mount('#app')