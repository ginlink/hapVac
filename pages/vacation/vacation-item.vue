<template>
  <view class="vacation-item">
    <view v-if="vacation" class="item">
      <view class="inner-item">
        <view class="title"> 我的 {{ vacation.type | showType }}申请 </view>
        <view class="time">
          {{ time }}
        </view>
        <view class="check" :style="{ color: statusColor }">
          {{ status }}
        </view>
      </view>
      <view class="outer-item">
        <view class="time">
          {{ vacation.start_time | showDay }}
        </view>
        <view class="icon">
          <uni-icons type="arrowright" size="17" color="#9b9b9b"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue'

export default {
  components: {
    uniIcons,
  },
  props: {
    vacation: {
      type: Object,
      default() {
        return null
      },
    },
  },
  filters: {
    showDay(time) {
      return time.slice(5, 11)
    },
    showType(type) {
      switch (type) {
        case 0:
          return '事假'
        case 1:
          return '病假'
        default:
          return '事假'
      }
    },
  },
  computed: {
    time() {
      const vacation = this.vacation

      console.log('[](vacation):', vacation)
      const start_time = vacation?.start_time
      const end_time = vacation?.end_time

      if (!start_time || !end_time) return ''

      const start = start_time.slice(5, 16)
      const end = end_time.slice(5, 16)

      const startStr2Hour = start_time.slice(0, 13)
      const endStr2Hour = end_time.slice(0, 13)

      const hour = this.getHour(startStr2Hour, endStr2Hour)
      return start + ' 至 ' + end + ' (共' + hour + '小时)'
    },
    status() {
      switch (this.vacation.status) {
        case 3:
          return '审批通过'
        case 4:
          return '未通过'
        case 1:
          return '未审核'
        case 2:
          return '已完成'
      }
      return '审批通过'
    },
    statusColor() {
      switch (this.vacation.status) {
        case 3:
          return '#09BB07'
        case 4:
          return '#f00'
        case 1:
          return '#3685f1'
        case 2:
          return '#9b9b9b'
      }

      return '#333'
    },
  },
  data() {
    return {}
  },
  methods: {
    getUnix(str) {
      return this.$dayjs(str, 'YYYY-MM-DD').unix()
    },
    getHour(startStr, endStr) {
      const startObj = this.$dayjs(startStr, 'YYYY-MM-DD HH')
      const endObj = this.$dayjs(endStr, 'YYYY-MM-DD HH')
      let diffHour = endObj.diff(startObj, 'hour')
      let diffDay = endObj.diff(startObj, 'day')

      // 处理有天数差异，月差异暂不考虑
      if (Math.abs(diffDay) > 0) {
        diffHour += diffDay * 24
      }

      return diffHour
    },
  },
}
</script>

<style lang="scss" scoped>
.vacation-item {
  .item {
    display: flex;
    // height: 90px;
    padding: 20rpx 30rpx;
    background: #fff;
    align-items: center;
    border-bottom: 2px solid #f5f5f5;
    position: relative;
    .inner-item {
      flex: 1;
      display: flex;
      flex-direction: column;
      .title {
        font-size: 34rpx;
      }
      .time {
        font-size: 28rpx;
        color: #9b9b9b;
      }
    }
    .outer-item {
      flex: 0.2;
      .time {
        position: absolute;
        top: 5px;
        color: #9b9b9b;
      }
      .icon {
        position: relative;
        left: 50%;
      }
    }
  }

  .check {
    color: $theme-color;
  }

  .actived {
    // background-color: #f00;
    color: #09bb07;
  }
}
</style>
