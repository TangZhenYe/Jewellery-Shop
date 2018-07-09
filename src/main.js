// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import router from './router'
import store from './vuex/store'
import VueAwesomeSwiper from 'vue-awesome-swiper'
import MuseUI from 'muse-ui'

import 'swiper/dist/css/swiper.css'
import 'muse-ui/dist/muse-ui.css'

import './global.css'
import './global.js'
import dialog from './dialogComponent.js'
import $ from 'jquery'


// import AnimatedVue from 'animated-vue'
// import 'animate.css/animate.css'

// Vue.use(AnimatedVue)

import 'vue2-animate/dist/vue2-animate.min.css'


Vue.use(dialog)
Vue.use(MuseUI)
Vue.use(VueAwesomeSwiper)
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
	el: '#app',
	router,
	store,
	components: {App},
	template: '<App/>'
})
