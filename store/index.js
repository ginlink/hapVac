import Vue from 'vue'
import Vuex from 'vuex'
import { USER_INFO } from '@/common/misc.js'

Vue.use(Vuex)

export const store = new Vuex.Store({
	state: {
		isLoadStartPage: false,
		centerMenu: null,
		appNum: undefined,
		notices: null,
		version: undefined,
		validCode: null,
		userInfo: {},
	},
	mutations: {
		updateIsLoadStartPage(store, payload) {
			store.isLoadStartPage = payload
		},
		updateCenterMenu(store, payload) {
			store.centerMenu = payload
		},
		updateAppNum(store, payload) {
			store.appNum = payload
		},
		updateNotices(store, payload) {
			store.notices = payload
		},
		updateVersion(store, payload) {
			store.version = payload
		},
		updateValidCode(store, payload) {
			store.validCode = payload
		},
		updateUserInfo(store, payload) {
			store.userInfo = payload

			// 本地也存一份
			uni.setStorageSync(USER_INFO, payload)
		}
	},
	getters: {
		centerMenu: state => {
			return state.centerMenu
		},
		appNum: state => {
			return state.appNum
		},
		notices: state => {
			return state.notices
		}
		,
		version: state => {
			return state.version
		},
		validCode: state => {
			return state.validCode
		},
		userInfo: state => {
			const localUserInfo = uni.getStorageSync(USER_INFO)
			const userInfo = state.userInfo

			return userInfo ? userInfo : localUserInfo
		}
	}
})