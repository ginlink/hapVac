import Request from '@/common/luch-request/index.js'

import { BASE_URL } from './config.js'

const http = new Request()
http.setConfig((config) => {
	config.baseUrl = BASE_URL
	config.timeout = 6000
	return config
})

http.validateStatus = (statusCode) => {
	return statusCode === 200
}

http.interceptor.request((config, cancel) => {
	//TODO 可以加上Token
	return config
})

// 必须使用异步函数，注意
http.interceptor.response(async (response) => {
	return response
}, (response) => {
	return response
})

export {
	http,
}
