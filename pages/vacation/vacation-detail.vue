<template>
  <view class="vacation-detail">
    <view class="navbar">
      <u-navbar title="请假详情" :border-bottom="false" titleColor="#303133" titleBold>
        <!-- #ifndef MP -->
        <view slot="right">
          <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
        </view>
        <!-- #endif -->
      </u-navbar>
    </view>

    <!-- <view v-if="vacation" class="content" :class="{ 'bottom-space': checkStatus.value == 4 }"> -->
    <view class="content u-skeleton" :class="{ 'bottom-space': checkStatus.value == 4 }">
      <view class="status">
        <view class="status-content">
          <view class="icon u-skeleton-circle" :style="{ backgroundColor: checkStatus.color }">
            <u-icon name="checkbox-mark" :color="'#fff'" size="112"></u-icon>
          </view>
          <text class="title u-skeleton-rect">{{ checkStatus.label }}</text>
        </view>
        <view class="check u-skeleton-rect">
          <view class="title"> 审批情况 </view>
          <view class="check-name">
            <text class="name">{{ vacation.check_name }}审批</text>
            <text class="check-time"> ({{ vacation.check_time }})</text>
          </view>
          <view class="check-status"> 审批意见: {{ checkAdviceLabel }} </view>
        </view>
        <view class="vacation u-skeleton-rect">
          <view class="vacation-header">
            <text class="title">请假详情</text>
            <text class="apply-time"> 申请时间{{ vacation.apply_time }} </text>
          </view>
          <view class="vacation-content">
            <view class="detail-item">
              <view class="title"> 开始请假时间: </view>
              <view class="value">
                {{ vacation.start_time }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 请假结束时间: </view>
              <view class="value">
                {{ vacation.end_time }}

                <view v-if="showDayDiff" class="badge">
                  {{ showDayDiff }}
                </view>
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 请假类型: </view>
              <view class="value">
                {{ vacation.type == 1 ? '事假' : '病假' }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 请假原因: </view>
              <view class="value">
                {{ vacation.reason }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 是否告知家长: </view>
              <view class="value">
                {{ vacation.is_tell_parent ? '是' : '否' }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 是否需要离校: </view>
              <view class="value">
                {{ vacation.is_leave_school ? '是' : '否' }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 紧急联系人: </view>
              <view class="value">
                {{ vacation.urgent_name }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 紧急联系人电话: </view>
              <view class="value">
                {{ vacation.urgent_tel }}
              </view>
            </view>
            <view class="detail-item">
              <view class="title"> 附件: 无 </view>
            </view>
          </view>
        </view>
      </view>
      <vac-footer v-if="checkStatus.value == 4" @action="action"></vac-footer>
    </view>

    <!-- <view v-else-if="!vacation && loaded" class="no-data"> -->
    <view v-if="!vacation && loaded" class="no-data">
      <view class="text"> 无此假条数据！ </view>
    </view>

    <u-skeleton :loading="loading" :animation="true" bgColor="#FFF"></u-skeleton>
  </view>
</template>

<script>
import VacFooter from './vacation-footer.vue'
import {
  FORMAT_TO_SECOND,
  FORMAT_TO_MINUTE,
  vacationAdvices,
  vacationStatus,
  vacationDetailStatus,
} from '@/common/misc.js'

export default {
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
  components: {
    VacFooter,
  },
  computed: {
    showDayDiff() {
      if (!this.vacation) return

      const start = this.$dayjs(this.vacation.start_time)
      const end = this.$dayjs(this.vacation.end_time)

      const dayDiff = end.diff(start, 'day') + 1

      console.log('[](dayDiff):', dayDiff)

      if (!dayDiff) return ''

      return dayDiff + '天'
    },
    checkStatus() {
      const vacation = this.vacation

      return vacationDetailStatus[vacation?.status ? vacation.status - 1 : 4]
    },
    checkStatusLabel() {
      const vacation = this.vacation

      if (!vacation) return ''

      return vacationDetailStatus[vacation.status ? vacation.status - 1 : 0].label
    },
    checkAdviceLabel() {
      const vacation = this.vacation

      if (!vacation) return ''

      return vacationAdvices[vacation.status ? vacation.status - 1 : 0].label
    },
  },
  data() {
    return {
      loaded: false,
      loading: false,
      currentId: undefined,
      vacationStatus: vacationStatus,
      vacationAdvices: vacationAdvices,

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
          data.start_time = dayjs.unix(data?.start_time).format(FORMAT_TO_MINUTE)
          data.end_time = dayjs.unix(data?.end_time).format(FORMAT_TO_MINUTE)
          data.apply_time = dayjs.unix(data?.apply_time).format(FORMAT_TO_SECOND)
          data.check_time = dayjs.unix(data?.check_time).format(FORMAT_TO_SECOND)

          this.vacation = data
          // setTimeout(() => {
          //   that.loading = false
          // }, 600)

          console.log('[](vacation):', this.vacation)
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
        })
    },
    action(flag) {
      const id = this.vacation.id
      switch (flag) {
        case 1:
          // 续假
          const action = 'edit'

          this.$Router.push({ path: '/pages/vacation/apply-vacation', query: { action, id } })
          break
        case 2:
          // 销假
          this.$Router.push({ path: '/pages/vacation/cancel-vacation', query: { id } })
          break
      }
    },
  },
}
</script>

<style lang="scss" scoped>
.vacation-detail {
  min-height: 100vh;
  background-color: $wm-bg-fff;

  // 占位，将底部tabbar空间预留
  .bottom-space {
    padding-bottom: 120rpx;
    padding-bottom: calc(120rpx + constant(safe-area-inset-bottom));
    padding-bottom: calc(120rpx + env(safe-area-inset-bottom));
  }

  .content {
    .check {
      margin-top: 80rpx;
    }

    .status {
      background: #fff;
      padding: 0 15px;
      .status-content {
        text-align: center;
        margin-top: 80rpx;
        .icon {
          margin: 0 auto;
          width: 200rpx;
          height: 200rpx;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
        }
        .title {
          font-size: 36rpx;
          font-weight: 500;
          display: block;
          margin-top: 30rpx;
        }
      }
      .check {
        .title {
          border-bottom: 1px solid #eee;
          padding-bottom: 15rpx;
          font-size: 32rpx;
        }
        .check-name {
          margin-top: 30rpx;
          .name {
            font-size: 30rpx;
          }
          .check-time {
            margin-top: 20rpx;
            margin-left: 3px;
            color: #9b9b9b;
            font-size: 24rpx;
          }
        }
        .check-status {
          margin-top: 15rpx;
          color: #9b9b9b;
          font-size: 26rpx;
        }
      }

      .vacation {
        margin-top: 30rpx;
        .vacation-header {
          display: flex;
          padding-bottom: 15rpx;
          border-bottom: 1px solid #eee;
          .title {
            flex: 1;
            font-size: 32rpx;
          }
          .apply-time {
            flex: 2;
            color: #9b9b9b;
            text-align: right;
            font-size: 28rpx;
          }
        }
      }
    }
  }

  .no-data {
    display: flex;
    align-items: center;
    justify-content: center;
    height: 80vh;
  }

  .vacation-content {
    margin-top: 15rpx;
    .detail-item {
      display: flex;
      align-items: center;
      padding: 3px 0;

      font-size: 29rpx;
      color: #636363;
      .title {
        flex: 1;
      }
      .value {
        flex: 2;
      }

      .badge {
        display: inline-block;
        font-size: 22rpx;
        color: #ffffff;
        background-color: #3685f1;
        text-align: center;
        vertical-align: baseline;
        padding: 7rpx 8rpx;
        margin-left: 6rpx;
        border-radius: 10rpx;
        line-height: 1;
      }
    }
  }
}
</style>
