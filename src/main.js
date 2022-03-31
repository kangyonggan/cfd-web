import {createApp} from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import './assets/style/theme.scss'
import './assets/style/element-variables.scss'
import 'element-plus/theme-chalk/display.css'
import VueAxios from 'vue-axios'
import axios from './util/axios'
import common from '@/util/common'
import NumberUtil from '@/util/number-util'
import DateTimeUtil from '@/util/date-time-util'
import zhCn from 'element-plus/es/locale/lang/zh-cn'


let app = createApp(App).use(store).use(router).use(ElementPlus, {locale: zhCn}).use(VueAxios, axios)
app.mount('#app')

app.config.globalProperties.$success = common.success
app.config.globalProperties.$error = common.error
app.config.globalProperties.$warning = common.warning
app.config.globalProperties.NumberUtil = NumberUtil
app.config.globalProperties.DateTimeUtil = DateTimeUtil

// 主题
document.documentElement.setAttribute('theme', localStorage.getItem('theme') || 'light');
