import Vue from 'vue'
import App from './App'
import { http } from '@/common/service/service.js'
import { store } from '@/store/index.js'
import dayjs from 'dayjs'
import customParseFormat from 'dayjs/plugin/customParseFormat';
import nh_utils from '@/common/utils/nh_utils.js'
import uView from "uview-ui";
import Toasts from '@/components/common/toast'
import toast from '@/common/transfer/toast.js'
import WechatMenu from '@/components/common/wechat-menu'
import AcidMenuPopup from '@/components/context/acid-menu-popup'

App.mpType = 'app'

Vue.use(uView);

// 引入dayjs
dayjs.extend(customParseFormat);

// request请求
Vue.prototype.$http = http

// store
Vue.prototype.$store = store

// 引入工具类
Vue.prototype.$utils = nh_utils

Vue.prototype.$dayjs = dayjs

// 挂载log
Vue.prototype.$log = (str, title = '$log') => {
	console.log('[' + title + ']：', str)
}

// 全局挂载toast对象
Vue.component('n-toast', Toasts)
toast(Vue)

// 挂载全局菜单
Vue.component('wechatMenu', WechatMenu)
Vue.component('acidMenuPopup', AcidMenuPopup)

const app = new Vue({
	...App
})
app.$mount()