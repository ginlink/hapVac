<template>
  <view class="vacation">
    <view class="navbar">
      <u-navbar :border-bottom="false" title="我的请假" titleColor="#303133" titleBold>
        <!-- #ifndef MP -->
        <view slot="right">
          <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
        </view>
        <!-- #endif -->
      </u-navbar>
    </view>

    <view v-if="vacationList.length == 0" class="list-empty">
      <view class="empty">
        <u-empty text="数据为空" mode="data"></u-empty>
      </view>
    </view>
    <view v-else class="content">
      <u-swipe-action
        v-for="(item, index) in vacationList"
        :show="item.show"
        :index="index"
        :key="item.id"
        :options="swiperOptions"
        @open="swiperOpen"
        @click="swiperClick"
      >
        <view class="item u-border-bottom">
          <!-- 此层wrap在此为必写的，否则可能会出现标题定位错误 -->
          <view class="title-wrap" @click="vacItemClick(item)">
            <vacation-item :vacation="item"></vacation-item>
          </view>
        </view>
      </u-swipe-action>
    </view>

    <view class="footer">
      <view class="btn">
        <button type="default" @click="applyVacation">请假</button>
      </view>
    </view>

    <u-modal
      v-model="deleteModalShow"
      :content="modalContent"
      :title="modalTitle"
      @confirm="deleteModalConfirm"
      show-cancel-button
    ></u-modal>

    <u-popup v-model="isSuper" mode="center" border-radius="14" width="80%" :mask-close-able="false">
      <view class="popup-header">
        <view class="popup-title">提示</view>
        <view class="popup-content">
          <view
            >您好，幸运请假每日最大服务量为{{ userMax }}人，您是第{{
              userPosition
            }}位，现已超出，请明日6点再来，谢谢理解。</view
          >
          <view>详情请见公告。</view>
        </view>
      </view>
      <view class="popup-footer" @click="popupSure">
        <view class="popup-sure">我知道了</view>
      </view>
    </u-popup>
  </view>
</template>

<script>
import VacationItem from './vacation-item'
import {
  VACATION_DETAIL,
  FORMAT_TO_SECOND,
  FORMAT_TO_MINUTE,
  FORMAT_TO_HOUR,
  FORMAT_TO_DAY,
  vacationAdvices,
  vacationStatus,
  vacationDetailStatus,
} from '@/common/misc.js'

export default {
  components: {
    VacationItem,
  },
  // onLoad() {
  //   // 请求假条条目
  //   this.fetchVacationList()
  // },
  onShow() {
    this.fetchVacationList()
  },
  data() {
    return {
      userPosition: 101,
      userMax: 100,
      isSuper: false,

      // 弹窗
      modalContent: '',
      modalTitle: '提示',
      deleteModalShow: false,

      swiperOptions: [
        {
          text: '编辑',
          style: {
            backgroundColor: '#007aff',
          },
        },
        {
          text: '删除',
          style: {
            backgroundColor: '#dd524d',
          },
        },
      ],

      vacationList: [],
      currentDeleteId: undefined,
    }
  },
  methods: {
    popupSure() {
      uni.navigateBack({ delta: 1 })
    },
    fetchVacationList() {
      const dayjs = this.$dayjs
      this.$http
        .get('/api/vacation')
        .then((res) => {
          //TODO 计划：分页功能
          const data = res.data

          const isSuper = data?.isSuper
          if (isSuper) {
            this.userPosition = data.count
            this.userMax = data.maxCount
            return (this.isSuper = true)
          }

          let list = data?.list

          if (!list) return

          // 先排序
          list = this.sortVacList(list)

          this.vacationList = list.map((item) => {
            //挂载swiperAction的显示开关
            item.show = false

            // 格式化时间
            item.start_time = dayjs.unix(item?.start_time).format(FORMAT_TO_MINUTE)
            item.end_time = dayjs.unix(item?.end_time).format(FORMAT_TO_MINUTE)

            return item
          })
        })
        .catch((err) => {
          uni.showToast({
            title: '服务器异常',
            icon: 'error',
            mask: true,
          })
          console.log('[](err):', err)
        })
    },
    deleteModalConfirm() {
      uni.showLoading({
        title: '删除中',
      })

      const id = this.currentDeleteId
      if (!id) return

      this.$http
        .delete(`/api/vacation/${id}`)
        .then((res) => {
          uni.showToast({
            title: '删除成功',
            icon: 'success',
            mask: true,
          })
          setTimeout(() => {
            this.deleteModalShow = false

            this.fetchVacationList()
          }, 1000)
        })
        .catch((err) => {
          uni.showToast({
            title: '删除失败',
            icon: 'error',
            mask: true,
          })
        })
        .finally(() => {
          uni.hideLoading()
        })
    },
    swiperClick(index, index1) {
      console.log('index1', index1)
      let item = this.vacationList[index]
      switch (index1) {
        case 1:
          this.currentDeleteId = item.id
          this.modalContent = '确认删除吗？'
          this.deleteModalShow = true
          break
        case 0:
          const action = 'edit'
          const id = item.id

          this.$Router.push({ path: '/pages/vacation/apply-vacation', query: { id, action } })
          break
      }
    },
    swiperOpen(index) {
      this.vacationList[index].show = true
      this.vacationList.map((val, idx) => {
        // 让其他关闭
        if (index != idx) this.vacationList[idx].show = false
        this.vacationList = Object.assign([], this.vacationList)
      })
    },
    vacItemClick(item) {
      // 跳转到详情页面
      const id = item.id

      this.$Router.push({ path: '/pages/vacation/vacation-detail', query: { id } })
    },
    applyVacation() {
      const action = 'add'
      this.$Router.push({ path: '/pages/vacation/apply-vacation', query: { action } })
    },
    sortVacList(vacations) {
      // 根据时间排序
      vacations.sort((a, b) => {
        // let aTime = this.$dayjs(a.start_time).unix()
        // let bTime = this.$dayjs(b.start_time).unix()
        let aTime = a.start_time
        let bTime = b.start_time

        return bTime - aTime
      })

      return vacations
    },
  },
}
</script>

<style lang="scss" scoped>
.vacation {
  min-height: 100vh;
  height: 1px;

  .content {
    height: 85vh;
    overflow: auto;
  }

  .footer {
    .btn {
      position: fixed;
      bottom: 0;
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
      width: 100%;
      height: 80rpx;

      button {
        width: 100%;
        background: $theme-color;
        color: $wm-bg-fff;
        font-size: 30rpx;
        line-height: 80rpx;
      }
    }
  }

  .list-empty {
    .empty {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
  }

  .popup-header {
    padding: 40rpx 30rpx 30rpx;
    .popup-title {
      font-size: 32rpx;
      font-weight: 500;
      text-align: center;
    }
    .popup-content {
      /* display: flex;
      justify-content: space-between;
      align-items: center; */
      padding: 0 15rpx;
      .url {
        color: #4177f6;
        font-size: 24rpx;
      }
    }
    .wrong-code {
      border-color: red;
    }
  }

  .popup-footer {
    border-top: 1px solid #eeeeee;

    .popup-sure {
      text-align: center;
      padding: 20rpx;
      color: #4177f6;
      font-weight: 500;
    }
  }
}
</style>
