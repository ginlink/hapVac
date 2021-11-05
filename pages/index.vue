<template>
  <view class="index">
    <stu-center v-if="startPage.indexOf('pages/student-center/index') != -1 && isValid" />
    <console v-else-if="startPage.indexOf('pages/console/index') != -1 && isValid" />
    <view v-else> </view>
  </view>
</template>

<script>
import { START_PAGE, VERSION } from '@/common/misc.js'
import StuCenter from './student-center/index.vue'
import Console from './console/index.vue'

function isUpdateVersion(o, n) {
  console.log('[](o, n):', o, n)
  const oArr = o.split('.')
  const nArr = n.split('.')
  const len = oArr.length

  for (let i = 0; i < len; ++i) {
    const nNum = parseInt(nArr[i])
    const oNum = parseInt(oArr[i])

    //截断处理
    if (nNum == oNum) continue
    else if (nNum > oNum) return true
    else return false
  }

  return false
}

export default {
  components: {
    StuCenter,
    Console,
  },
  data() {
    return {
      isValid: false,
      shouldValidCode: '',
      comparedVersion: false,
      startPage: '',
    }
  },
  created() {
    // this.startPage = uni.getStorageSync(START_PAGE) || '/pages/console/index'
    this.startPage = '/pages/student-center/index'

    // this.$Router.push({ path: '/pages/record/index', query: { userId: '123' } })
  },
  computed: {
    show: {
      get() {
        // const localVersion = uni.getStorageSync(VERSION)
        // const remoteVersion = this.$store.getters.version?.version

        // // 比较过version，则不再弹窗
        // if (this.comparedVersion) return false

        // // 有更新，则显示弹窗
        // if (localVersion && remoteVersion) {
        //   return isUpdateVersion(localVersion, remoteVersion)
        // } else if (!localVersion) {
        //   // 第一次进来，显示弹窗
        //   return true
        // }

        // return false

        const correctCode = this.$store.getters.validCode?.code

        if (this.isValid) return false

        if (correctCode == 'noValid') {
          this.isValid = true
          return false
        }

        const localValidCode = uni.getStorageSync('LOCAL_VALID_CODE')

        console.log('[](localValidCode,shouldValidCode,correctCode):', localValidCode, correctCode)

        const isValid = localValidCode === correctCode

        this.isValid = isValid
        return !isValid
      },
      set(val) {
        console.log('[](val):', val)
        // this.show = val
        return val
      },
    },
    contents() {
      const contents = this.$store.getters.version?.contents

      return contents || []
    },
    title() {
      return this.$store.getters.validCode?.title || ''
    },
    correctCode() {
      return this.$store.getters.validCode?.code || ''
    },
  },
  methods: {
    getWechatUserInfo() {
      const that = this

      uni.getUserProfile({
        desc: '绑定用户',
        success: function (infoRes) {
          console.log('用户昵称为：' + infoRes.encryptedData)

          const encryptedData = infoRes.encryptedData
          const iv = infoRes.iv

          that.$http.post('/api/user/getUserInfo/', { encryptedData, iv }).then((res) => {
            console.log('[getUserInfo](userInfo):', res)
          })
        },
      })
    },
    loginWechat() {
      uni.login({
        provider: 'weixin',
        success: function (loginRes) {
          console.log(loginRes.authResult)

          const code = loginRes.code

          uni.request({
            // url: 'http://192.168.3.42:3040/api/auth/login', //仅为示例，并非真实接口地址。
            url: 'http://192.168.3.72:3040/api/auth/login', //仅为示例，并非真实接口地址。
            method: 'POST',
            data: {
              code,
            },
            header: {
              'custom-header': 'hello', //自定义请求头信息
            },
            success: (res) => {
              console.log(res.data)
            },
          })
        },
      })
    },
    sure() {
      console.log('[](我知道了):')
      // 更新本地版本
      // const version = this.$store.getters.version?.version

      // if (version) {
      //   uni.setStorageSync(VERSION, version)
      //   this.comparedVersion = true
      // }

      if (this.shouldValidCode === this.correctCode) {
        uni.setStorageSync('LOCAL_VALID_CODE', this.shouldValidCode)
        return (this.isValid = true)
      }

      return (this.shouldValidCode = '体验码错误')
    },
    look(url) {
      uni.navigateTo({
        url,
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.index {
  .popup-wrapper {
    .popup-content {
      padding: 40rpx 30rpx 30rpx;
      .title {
        font-size: 32rpx;
        font-weight: 500;
        text-align: center;
      }
      .content {
        display: flex;
        justify-content: space-between;
        align-items: center;
        margin: 15rpx 0;
        .url {
          color: #4177f6;
          font-size: 24rpx;
        }
      }
      .wrong-code {
        border-color: red;
      }
    }

    .footer {
      border-top: 1px solid #eeeeee;

      .sure {
        text-align: center;
        padding: 20rpx;
        color: #4177f6;
        font-weight: 500;
      }
    }
  }
}
</style>
