import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import MuseUI from 'muse-ui'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import dialog from './dialogComponent.js'

// 加载插件全部样式
import 'swiper/dist/css/swiper.css'
import 'muse-ui/dist/muse-ui.css'

// 加载全局样式和方法
import './global.js'
import './global_methods.js'
import './global_router.js'
import './vConsole.js'
import './global.scss'

Vue.use(dialog)
Vue.use(MuseUI)
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false

new Vue({ el: '#app', router, store, components: {App}, template: '<App/>' })