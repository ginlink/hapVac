<template>
  <view class="vacation-item">
    <view v-if="vacation" class="item">
      <view class="inner-item">
        <view class="title"> 我的 {{ vacation.type == 1 ? '事假' : '病假' }}申请 </view>
        <view class="time">
          {{ crossTime }}
        </view>
        <view class="check" :style="{ color: checkStatus.color }">
          {{ checkStatus.label }}
        </view>
      </view>
      <view class="outer-item">
        <view class="time">
          {{ vacation.start_time.slice(5, 11) }}
        </view>
        <view class="icon">
          <uni-icons type="arrowright" size="12" color="#9b9b9b"></uni-icons>
        </view>
      </view>
    </view>
  </view>
</template>

<script>
import uniIcons from '@/components/uni-icons/uni-icons.vue'
import { vacationListStatus } from '@/common/misc.js'

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
  computed: {
    checkStatus() {
      const vacation = this.vacation

      if (!vacation) return ''

      return vacationListStatus[vacation.status ? vacation.status - 1 : 0]
    },
    crossTime() {
      const vacation = this.vacation

      console.log('[](vacation):', vacation)
      const start_time = vacation?.start_time
      const end_time = vacation?.end_time

      if (!start_time || !end_time) return ''

      const start = start_time.slice(5, 16)
      const end = end_time.slice(5, 16)

      const startStr2Hour = start_time.slice(0, 13)
      const endStr2Hour = end_time.slice(0, 13)

      const hour = this.hourDiff(startStr2Hour, endStr2Hour)
      return start + ' 至 ' + end + ' (共' + hour + '小时)'
    },
  },
  data() {
    return {}
  },
  methods: {
    hourDiff(startStr, endStr) {
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

    .title {
      font-size: 28rpx;
    }
    .time {
      font-size: 24rpx;
      color: #9b9b9b;
    }
    .check {
      font-size: 24rpx;
    }

    .inner-item {
      flex: 1;
      display: flex;
      flex-direction: column;
    }
    .outer-item {
      flex: 0.1;
      .time {
        position: absolute;
        top: 5px;
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
