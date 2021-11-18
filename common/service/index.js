import Request from '@/common/luch-request/index.js'

import { BASE_URL } from './config.js'
import { USER_INFO } from "@/common/misc.js";

const http = new Request()
http.setConfig((config) => {
	config.baseUrl = BASE_URL
	config.timeout = 6000
	return config
})

http.validateStatus = (statusCode) => {
	return statusCode === 200 || statusCode === 201
}

http.interceptor.request((config, cancel) => {
	const userInfo = uni.getStorageSync(USER_INFO)

	const token = userInfo?.token

	console.log('[](token):', token)

	config.header = {
		Authorization: `Bearer ${token}`
	}
	return config
})

// 必须使用异步函数，注意
http.interceptor.response(async (response) => {
	const statusCode = response.statusCode
	console.log('[resolve](statusCode):', statusCode)

	return response.data
}, (response) => {
	const statusCode = response.statusCode
	const data = response.data
	console.log('[reject](statusCode):', statusCode)

	switch (statusCode) {
		case 401:
			uni.showToast({
				title: '请先登录',
				icon: 'error',
				mask: true
			})
			setTimeout(() => {
				// uni.redirectTo({ url: '/pages/login/index' })
				uni.navigateTo({ url: '/pages/login/index' })
			}, 1000);
			break;
		case 400:
			uni.showToast({
				title: data.msg,
				icon: 'error',
				mask: true
			})
			break;
	}

	return response.data
})

export {
	http,
}
