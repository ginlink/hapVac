import Vue from 'vue'
import App from './App'
import { http } from '@/common/service/index.js'
import { store } from '@/store/index.js'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import uView from "@/components/uview-ui";
import WechatMenu from '@/components/common/wechat-menu'
import AcidMenuPopup from '@/components/context/acid-menu-popup'
import { router, RouterMount } from "./router.js";


App.mpType = 'app'

Vue.use(uView);
//引入router只是为了使用路由守卫（登录用）
Vue.use(router);

// 引入dayjs
dayjs.extend(customParseFormat);

// request请求
Vue.prototype.$http = http

// store
Vue.prototype.$store = store

Vue.prototype.$dayjs = dayjs

// 挂载log
Vue.prototype.$log = (str, title = '$log') => {
	console.log('[' + title + ']：', str)
}

// 挂载全局菜单
Vue.component('wechatMenu', WechatMenu)
Vue.component('acidMenuPopup', AcidMenuPopup)

const app = new Vue({
	...App
})

//v1.3.5起 H5端 你应该去除原有的app.$mount();使用路由自带的渲染方式
// #ifdef H5
RouterMount(app, router, '#app')
// #endif

// #ifndef H5
app.$mount(); //为了兼容小程序及app端必须这样写才有效果
// #endif