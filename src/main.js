import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus';
import 'element-plus/lib/theme-chalk/index.css';

import NaiveUi from 'naive-ui'

createApp(App).use(store).use(ElementPlus).use(router).use(NaiveUi).mount('#app')
