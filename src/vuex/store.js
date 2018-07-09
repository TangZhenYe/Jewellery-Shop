import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)


const state = {
	token: '',
	token_time: '',
	title_msg: '',
	parent_id: '',
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
}

export default new Vuex.Store({
	state,
	mutations,
})