<script>
import { VACATION_DETAIL, STUDENT_CENTER_MENU } from '@/common/misc.js'
import { START_PAGE } from '@/common/misc.js'
import { updateUserInfoAction } from '@/store/actions.js'

export default {
  onLaunch: function () {
    uni.showLoading({
      title: '加载中',
      mask: true,
    })
    console.log('App Launch')

    this.checkSession()

    this.initCenterMenu()

    this.initUserInfo()

    setInterval(() => {
      this.checkSession()

      this.initCenterMenu()

      this.initUserInfo()
    }, 15000)

    // this.initData() // 初始化全局信息

    // this.initAppNum()

    // this.initNoticeList()

    // this.initVersion()

    // this.initValidCode()
  },
  onShow: function () {
    console.log('App Show')
  },
  onHide: function () {
    console.log('App Hide')
  },
  methods: {
    initUserInfo() {
      updateUserInfoAction(this)
      // this.$http
      //   .get('/api/user')
      //   .then((res) => {
      //     const data = res.data ?? []

      //     this.$store.commit('updateUserInfo', data)
      //   })
      //   .catch((err) => {
      //     console.log('err:func(initUserInfo)(user)', err)
      //   })
    },
    initCenterMenu() {
      this.$http
        .get('/api/application')
        .then((res) => {
          const data = res.data ?? []

          let utilList = { open_num: 0, data: [] }
          let studyList = { open_num: 0, data: [] }
          let otherList = { open_num: 0, data: [] }

          data.map((item) => {
            switch (item.type) {
              case 'util':
                utilList.data.push(item)

                if (item.is_open) ++utilList.open_num
                break
              case 'study':
                studyList.data.push(item)

                if (item.is_open) ++studyList.open_num
                break
              case 'other':
                otherList.data.push(item)

                if (item.is_open) ++otherList.open_num
                break
            }
          })

          // 区分类别
          /**
           * {
           *  utilList:{open_num: 1, data: []}
           *  studyList:{open_num: 1, data: []}
           *  otherList:{open_num: 1, data: []}
           * }
           */

          this.$store.commit('updateCenterMenu', { utilList, studyList, otherList })
        })
        .catch((err) => {
          console.log('err:func(created)(stu)', err)
        })
    },
    checkSession() {
      // 检查用户session是否过期，过期则跳转登录页面，更新个人头像等信息
      uni.checkSession({
        // 过期
        fail: function (err) {
          console.log('[](err):', '信息过期，去登录', err)
          this.$Router.push('/pages/login/index')
        },
      })
    },
    initValidCode() {
      this.$http
        .get('/api/validCode')
        .then((res) => {
          const data = res.data.data ?? {}
          const validCode = data
          if (!validCode) return

          this.$store.commit('updateValidCode', validCode)
        })
        .catch((err) => {
          console.log('err:func(initValidCode)(validCode request failed!)', err)
        })
    },
    initVersion() {
      this.$http
        .get('/api/version')
        .then((res) => {
          const data = res.data.data ?? {}
          const version = data
          if (!version) return

          this.$store.commit('updateVersion', version)
        })
        .catch((err) => {
          console.log('err:func(initVersion)(version request failed!)', err)
        })
    },
    initNoticeList() {
      this.$http
        .get('/api/notices')
        .then((res) => {
          const data = res.data.data ?? {}
          const notices = data?.notices
          if (!notices) return

          this.$store.commit('updateNotices', notices)
        })
        .catch((err) => {
          console.log('err:func(initNoticeList)(notices request failed!)', err)
        })
    },
    initAppNum() {
      this.$http
        .get('/api/appNum')
        .then((res) => {
          const data = res.data.data ?? {}
          const appNum = data?.app_num
          if (!appNum) return

          this.$store.commit('updateAppNum', appNum)
        })
        .catch((err) => {
          console.log('err:func(applications)(created)', err)
        })
    },
    // this.initVacation
    initData() {
      if (!uni.getStorageSync(VACATION_DETAIL)) {
        // [服务器] 请求默认数据
        this.$http
          .get('/api/vac/sample')
          .then((res) => {
            uni.setStorageSync(VACATION_DETAIL, res.data)
          })
          .catch((err) => {
            console.log('err:func(App)(initData)', err)
          })
      }

      return

      // let vacDetail = uni.getStorageSync(VACATION_DETAIL)
      // if (!uni.getStorageSync(VACATION_DETAIL)) {
      // 	uni.setStorageSync(VACATION_DETAIL, VacationDetailInfo)
      // }
      // if (!uni.getStorageSync(STUDENT_CENTER_MENU)) {
      // 	uni.setStorageSync(STUDENT_CENTER_MENU, centerMenu)
      // }
      // console.log('[APP]vacDetail:', vacDetail);
    },
  },
}
</script>

<style lang="scss">
@import '@/components/uview-ui/index.scss';
/* uni.css - 通用组件、模板样式库，可以当作一套ui库应用 */
@import './common/uni.css';

view {
  font-size: 32rpx;
}

// 通用form样式
.form-wrapper {
  padding: 0 30rpx 0;
  background-color: $wm-bg-fff;

  .switch {
    /* background-color: #f00; */
  }

  .btn {
    font-size: 28rpx;
    color: $wm-bg-fff;
    background-color: $theme-color;
    // margin-top: 30rpx;
    margin-top: 60rpx;
  }
}

// 通用form样式
// 通用右侧菜单
.wechat-menu-wrapper {
  margin-right: 15rpx;
}

// 通用右侧菜单

/* #ifdef APP-PLUS */
page {
  background-color: #f8f8f8;
}
view {
  font-size: 32rpx;
}

/* #endif */

/* H5 兼容 pc 所需 */
/* #ifdef H5 */
@media screen and (min-width: 768px) {
  body {
    overflow-y: scroll;
  }
}

/* 顶栏通栏样式 */
/* .uni-top-window {
	    left: 0;
	    right: 0;
	} */
uni-page-body {
  background-color: #f8f8f8 !important;
  min-height: 100% !important;
  height: auto !important;
}

.uni-top-window uni-tabbar .uni-tabbar {
  background-color: #fff !important;
}

.uni-app--showleftwindow .hideOnPc {
  display: none !important;
}
/* #endif */

.card {
  background-color: $uni-bg-color;
  border-radius: 20rpx;
  padding: 30rpx 30rpx;
}

.page {
  padding: 40rpx 30rpx;
  min-height: 100vh;
  font-size: 32rpx;
}

@import './spacing.scss';
@import './row.scss';
@import './typography.scss';
</style>
