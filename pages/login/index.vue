<template>
  <view class="login-wrapper">
    <view class="navbar">
      <u-navbar title="登录" :border-bottom="false" backIconSize="56" titleColor="#303133" titleBold>
        <!-- #ifndef MP -->
        <view slot="right">
          <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
        </view>
        <!-- #endif -->
      </u-navbar>
    </view>

    <view class="login-area">
      <view class="statement">
        <view class="title">登录后即可展示自己</view>
        <view class="desc">登录即表示同意<text>用户服务协议</text>和<text>隐私协议</text></view>
      </view>
      <view class="button" @click="getUserInfo">
        <view class="icon"><u-icon name="weixin-fill" color="#51aa38" size="28"></u-icon></view>
        <view class="text">微信登录</view>
      </view>
    </view>
  </view>
</template>

<script>
export default {
  components: {},
  data() {
    return {}
  },
  created() {
    // 先获取到token
    this.wechatLogin()
  },
  methods: {
    async getAllVacations() {
      const res = await this.$http.get('/api/vacation')
    },
    getUserInfo() {
      const that = this

      uni.getUserProfile({
        desc: '绑定用户',
        success: function (infoRes) {
          const encryptedData = infoRes.encryptedData
          const iv = infoRes.iv

          that.$http.post('/api/user/getUserInfo/', { encryptedData, iv }).then((res) => {
            console.log('[getUserInfo](userInfo):', res)
          })
          uni.showToast({
            title: '微信登录成功',
            icon: 'success',
            mask: true,
          })
          uni.navigateBack({ delta: 1 })
        },
        fail() {
          uni.showToast({
            title: '获取用户信息失败',
            icon: 'error',
            mask: true,
          })
        },
      })
    },
    wechatLogin() {
      const that = this

      uni.login({
        provider: 'weixin',
        success: async function (loginRes) {
          console.log(loginRes.authResult)

          const code = loginRes.code

          const res = await that.$http.post('/api/auth/login', { code })
          const token = res.data?.token

          if (!token) throw new Error('登录失败')

          const oldUserInfo = that.$store.getters.userInfo

          that.$store.commit('updateUserInfo', Object.assign(oldUserInfo, { token }))
        },
        fail() {
          uni.showToast({
            title: '微信登录失败',
            icon: 'error',
            mask: true,
          })
        },
      })
    },
  },
}
</script>

<style lang="scss" scoped>
.login-wrapper {
  width: 100%;
  /* display: flex;
  align-items: center;
  justify-content: center; */
  padding: 60rpx 60rpx;

  .login-area {
    width: 100%;
    background-color: #fff;
    border-radius: 15rpx;
    padding: 60rpx 60rpx;
    .statement {
      .title {
        font-size: 36rpx;
        text-align: center;
      }
      .desc {
        font-size: 24rpx;
        text-align: left;
        text {
          color: $theme-color;
        }
      }
    }

    .button {
      display: flex;
      align-items: center;
      justify-content: center;
      border: 1px solid $theme-color;
      border-radius: 15rpx;
      padding: 15rpx 30rpx;

      margin-top: 30rpx;
      .icon {
      }
      .text {
        color: $theme-color;
        margin-left: 15rpx;
      }
    }
  }
}
</style>
