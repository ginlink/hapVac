<template>
  <view class="page code-wrapper">
    <view class="navbar">
      <u-navbar :border-bottom="false" title="电子假条" titleColor="#303133" titleBold>
        <!-- #ifndef MP -->
        <view slot="right">
          <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
        </view>
        <!-- #endif -->
      </u-navbar>
    </view>

    <view class="content">
      <view class="row-between card">
        <view class="info-wrapper mr-3">
          <view class="row-start info">
            <view class="sub-header">{{ studentName }}</view>
            <view v-if="studentSex == '男'" class="ml-1">
              <image src="@/static/vacation/male.png"></image>
            </view>
            <view v-if="studentSex == '女'" class="ml-1">
              <image src="@/static/vacation/female.png"></image>
            </view>
          </view>
          <view class="grey sub-small">学号 {{ studentNumber }}</view>
          <view class="grey sub-small">班级 {{ studentGrade }}</view>

          <view class="mt-2 pt-1 bold yard">{{ studentYard }}</view>
        </view>

        <view>
          <view class="code"> <image src="@/static/vacation/code.png"></image> </view>
          <view class="small"> 防伪码:微信扫码核验 </view>
        </view>
      </view>
      <view class="column-center card mt-2 my-card">
        <view class="row-center">
          <view><u-icon name="clock" size="24"></u-icon></view>
          <view class="small">请假时间</view>
        </view>
        <view> {{ duration }} </view>
        <view class="box">
          <view class="info-avatar" @click.stop="chooseImage">
            <image :src="studentIcon || userInfo.avatar_url"></image>
          </view>
        </view>
        <view class="sub-small">生成于 {{ createTime }}</view>
      </view>
    </view>
  </view>
</template>

<script>
import { STUDENT_INFO, FORMAT_TO_SECOND } from '@/common/misc.js'

export default {
  components: {},
  onLoad() {
    const { id } = this.$Route.query

    if (!id) {
      return uni.showToast({
        title: '未知错误',
        icon: 'error',
        mask: true,
      })
    }
    this.currentId = id
  },
  onShow() {
    this.fetchVacation()
  },
  created() {
    const studentInfo = uni.getStorageSync(STUDENT_INFO)
    console.log('[studentInfo]:', studentInfo)

    this.studentName = studentInfo.name
    this.studentGrade = studentInfo.grade
    this.studentYard = studentInfo.yard
    this.studentNumber = studentInfo.number
    this.studentSex = studentInfo.sex
    this.studentIcon = studentInfo.icon
  },
  computed: {
    userInfo() {
      return this.$store.getters?.userInfo
    },
  },
  data() {
    return {
      isLoad: false,
      studentName: '',
      studentNumber: '',
      studentGrade: '',
      studentYard: '',
      studentSex: '',
      studentIcon: '',
      currentId: undefined,
      createTime: '',
      duration: '',
      vacation: {
        check_name: '李旺',
        check_time: '2021-11-06 20:18:00',
        apply_time: '2021-11-06 19:17:03',
        start_time: '2021-11-06 09:00',
        end_time: '2021-11-06 20:00',
        reason: '身体不适',
        urgent_name: '王丽华',
        urgent_tel: '13897004370',
      },
    }
  },
  methods: {
    fetchVacation() {
      uni.showLoading({
        title: '加载中',
        mask: true,
      })

      const id = this.currentId

      if (!id) {
        return uni.showToast({
          title: '未知错误',
          icon: 'error',
          mask: true,
        })
      }
      // this.loading = true
      const that = this

      const dayjs = this.$dayjs
      this.$http
        .get('/api/vacation/' + id)
        .then((res) => {
          const data = res.data

          if (!data) throw new Error('')

          const start = dayjs.unix(data.start_time).format('YYYY年M月D日HH时')
          const end = dayjs.unix(data.end_time).format('M月D日HH时')
          this.duration = start + ' - ' + end

          this.createTime = dayjs.unix(data?.apply_time).format(FORMAT_TO_SECOND)
        })
        .catch((err) => {
          uni.showToast({
            title: '获取假条失败',
            icon: 'error',
            mask: true,
          })
          that.loading = false
          console.log('[/api/vacation](err):', err)
        })
        .finally(() => {
          this.loaded = true

          const random = 100 + Math.random() * 600

          setTimeout(() => {
            uni.hideLoading()
          }, random)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.code-wrapper {
  min-height: 100vh;
  background-color: $theme-color;

  .info {
    image {
      width: 28rpx;
      height: 34rpx;
    }
  }

  .code {
    image {
      width: 188rpx;
      height: 188rpx;
    }
  }

  .my-card {
    padding: 50rpx 0 112rpx;
  }

  .box {
    border: 3px solid #6787be;
    border-radius: 16rpx;
    margin: 32rpx 0;

    .info-avatar {
      width: 356rpx;
      height: 440rpx;
      image {
        width: 356rpx;
        height: 440rpx;
      }
    }
  }

  .info-wrapper {
    flex: 1;
  }

  .yard {
    border-top: 1rpx solid rgba(155, 155, 155, 0.5);
  }
}
</style>
