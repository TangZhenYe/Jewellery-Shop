import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
	token: '',
	token_time: '',
	title_msg: '首页',
	parent_id: '',
	debug: 'false', // 是否开启微信分享调试
	scopeImgUrl: 'http://www.taiwaskii.com/app/zhubaoshangcheng/static/img/share_logo.jpg', // 分享朋友圈图片
	check_time: 7200, // 判断时间过期的边界 7200秒 即2个小时
	countNum: '',
}

const mutations = {
	updateToken (state, payload) {
		state.token = payload.token
		state.token_time = payload.token_time
	},
	updateParentId (state, payload) {
		state.parent_id = payload.parent_id
	},
	updateTitleMsg (state, payload) {
		state.title_msg = payload.title_msg
	},
	updateCountNum (state, payload) {
		state.countNum = payload.countNum
	},
	updateDebug (state, payload) {
		state.debug = payload.debug
	},
	updateScopeImgUrl (state, payload) {
		state.scopeImgUrl = payload.scopeImgUrl
	},
	updateCheckTime (state, payload) {
		state.check_time = payload.check_time
	},
}

export default new Vuex.Store({
	state,
	mutations,
})