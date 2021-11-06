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

    <view class="content">
      <u-swipe-action
        v-for="(item, index) in vacationList"
        :show="item.show"
        :index="index"
        :key="item.id"
        @open="open"
        :options="options"
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

    <view class="plug">
      <view v-if="vacationList && vacationList.length == 0" class="empty">
        <u-empty text="数据为空" mode="data"></u-empty>
      </view>

      <!-- popup弹窗 -->
      <view class="popup">
        <u-popup ref="popup" v-model="show" mode="bottom" :height="height" closeable>
          <view class="pop-content-wrapper">
            <u-form class="form" :model="form" ref="uForm">
              <u-form-item class="item" :label-width="labelWidth" label="类型" prop="type">
                <u-input v-model="form.type" />
              </u-form-item>
              <u-form-item class="item" :label-width="labelWidth" label="开始时间" prop="startTime">
                <u-input v-model="form.startTime" />
              </u-form-item>
              <u-form-item class="item" :label-width="labelWidth" label="结束时间" prop="endTime">
                <u-input v-model="form.endTime" />
              </u-form-item>
              <u-form-item class="item" :label-width="labelWidth" label="共计x小时" prop="totalHour">
                <u-input v-model="form.totalHour" />
              </u-form-item>
              <u-form-item class="item" :label-width="labelWidth" label="审批情况" prop="status">
                <u-input v-model="form.status" />
              </u-form-item>
            </u-form>
            <button type="default" class="btn" @click="submit">提交</button>
          </view>
        </u-popup>
      </view>

      <u-toast ref="uToast" />
      <u-top-tips ref="uTips" :z-index="99999"></u-top-tips>

      <u-modal
        v-model="modalShow"
        :content="modalContent"
        :title="modalTitle"
        @confirm="modalConfirm"
        show-cancel-button
      ></u-modal>

      <!-- popup弹窗 -->
    </view>
  </view>
</template>

<script>
// import VacationItem from './children/VacationItem'
import VacationItem from './vacation-item'

import { VACATIONDETAIL, FORMATSECOND, FORMATHOUR, FORMATDAY } from '@/common/misc.js'

export default {
  components: {
    VacationItem,
  },
  watch: {
    show(n, o) {
      // if(this.isSetedRules) return

      if (o) return

      if (!n) return
      this.$nextTick(function () {
        console.log('uForm:', this.$refs.uForm)
        this.$refs.uForm.setRules(this.rules)
        // this.isSetedRules = true
      })
    },
  },
  // onLoad() {
  //   this.initVacList()
  //   this.initEvent()
  // },
  onShow() {
    // this.sortVacList()
    // this.vacationList = Object.assign([], this.vacationList)
  },
  data() {
    return {
      // 辅助变量
      isInited: false,
      isListened: false,
      // 辅助变量
      // vac
      currentIndex: -1,
      // vac

      // 弹窗
      modalContent: '',
      modalTitle: '提示',
      modalShow: false,
      // 弹窗

      // form
      labelWidth: 150,
      rules: {
        totalHour: [
          {
            required: true,
            message: '请输入总时间',
            // 可以单个或者同时写两个触发验证方式
            trigger: ['change', 'blur'],
          },
        ],
        // intro: [{
        // 	min: 5,
        // 	message: '简介不能少于5个字',
        // 	trigger: 'change'
        // }]
      },
      form: {
        type: 0, // 类型
        startTime: '',
        endTime: '',
        totalHour: 0, // 共计时间
        // status: true, // 审批情况
        status: 0, // 审批情况
        reason: '',
        isTellParent: 0,
        isLeaveSchool: 0,
      },
      // form

      // popup
      height: '90%',
      isSetedRules: false,
      show: false,
      // show: true,

      options: [
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
    }
  },
  onLoad() {
    // 请求假条条目
    // this.initVacData()

    this.$http
      .get('/api/vacation')
      .then((res) => {
        //TODO 计划：分页功能
        const list = res.data.list

        this.vacationList = list
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
  methods: {
    // form
    submit() {
      this.$refs.uForm.validate((valid) => {
        if (valid) {
          console.log('验证通过')
          console.log('form:', this.form)
          // uni.showLoading({
          // 	title: '加载中'
          // })

          // this.$refs.uToast.show({
          this.$refs.uTips.show({
            title: '更改成功',
            type: 'success',
            duration: '2000',
          })
          setTimeout(() => {
            // uni.hideLoading()
            this.show = false
          }, 1000)
        } else {
          console.log('验证失败')
          // this.$refs.uToast.show({
          // 	title: '铁马冰河入梦来',
          // 	type: 'error',
          // 	duration: '2300'
          // })
        }
      })
    },
    // form

    saveVac() {
      let tmp = uni.getStorageSync(VACATIONDETAIL)
      if (!tmp) return this.$log('wran:(本地无数据)')

      tmp.data.list = this.vacationList
      uni.setStorageSync(VACATIONDETAIL, tmp)
    },
    delVac() {
      if (this.currentIndex == -1) return

      // 删除页面内容
      this.vacationList.splice(this.currentIndex, 1)
      this.saveVac()
    },

    timeOut(callback, title = '操作中') {
      let delay = 700
      uni.showLoading({
        title,
      })
      setTimeout(() => {
        uni.hideLoading()
        callback()
      }, delay)
    },

    // 弹窗
    modalConfirm() {
      this.timeOut(() => {
        this.delVac()
      }, '删除中')
    },
    // 弹窗

    // SwiperAction
    swiperClick(index, index1) {
      console.log('index1', index1)
      let item = this.vacationList[index]
      switch (index1) {
        case 1:
          // [删除]
          // this.vacationList.splice(index, 1);

          this.currentIndex = index
          this.modalContent = '确认删除吗？'
          this.modalShow = true

          // this.$u.toast(`删除了第${index}个cell`);
          break
        case 0:
          const action = 'edit'
          const id = item.id

          // uni.navigateTo({ url: `/pages/vacation/apply-vacation?action=${action}&id=${id}` })

          this.$Router.push({ url: '/pages/vacation/apply-vacation', query: { id, action } })
          break
      }
    },
    open(index) {
      this.vacationList[index].show = true
      this.vacationList.map((val, idx) => {
        if (index != idx) this.vacationList[idx].show = false
        this.vacationList = Object.assign([], this.vacationList)
      })
    },

    // 假条点击事件
    vacItemClick(item) {
      const id = item.id
      const action = 'edit'

      this.$Router.push({ path: '/pages/vacation/apply-vacation', query: { id, action } })
    },
    applyVacation() {
      const action = 'add'
      this.$Router.push({ path: '/pages/vacation/apply-vacation', query: { action } })
      // this.$Router.push({ path: `/pages/vacation/apply-vacation?action=${action}` })
    },

    calcOtherTime() {
      this.$log(this.vacationList, '第一次，处理假条')
      const self = this

      if (this.vacationList.length > 0) {
        let vac = this.vacationList[0]
        if (!vac) return
        if (vac.id == 1) {
          if (!this.isInited) {
            this.isInited = true
            return [actionCalcTime(vac)]
          }
        }
      }
      return
      // 计算申请时间和审核时间
      function actionCalcTime(vac) {
        let times = calcTime(vac)

        vac.detail.checkTime = times.checkTime
        vac.detail.applyTime = times.applyTime
        return vac
      }

      function calcTime(vac) {
        if (!vac) return
        self.$log(vac, 'vac')
        let startTime = vac.detail.startTime
        startTime = self.$dayjs(startTime, 'YYYY-MM-DD HH:mm:ss')

        let checkTime = startTime.subtract(getRandom(10, 30), 'minute').add(getRandom(0, 60), 'second')
        let applyTime = startTime.subtract(getRandom(30, 60), 'minute').add(getRandom(0, 60), 'second')

        return {
          checkTime: checkTime.format(FORMATSECOND, 'startTime'),
          applyTime: applyTime.format(FORMATSECOND, 'startTime'),
        }

        function getRandom(start, end) {
          return Math.floor(Math.random() * (end - 10) + start)
        }
      }
    },
    sortVacList() {
      // 根据时间排序
      // 开始时间
      this.vacationList = this.vacationList.sort((a, b) => {
        let aTime = this.$dayjs(a.detail.startTime, FORMATSECOND).unix()
        let bTime = this.$dayjs(b.detail.startTime, FORMATSECOND).unix()

        return bTime - aTime
      })

      // this.$log(this.vacationList, 'vacationList')
    },
    initVacList() {
      const self = this

      this.vacationList = [] // 置空

      let vacationDetail = uni.getStorageSync(VACATIONDETAIL)
      // 防止读取不到数据
      if (!vacationDetail)
        return setTimeout(() => {
          initVacList()
        }, 1000)

      this.vacationList = vacationDetail && vacationDetail.data && vacationDetail.data.list

      // 计算申请时间和审核时间，只处理第一个
      let tmp = null
      if (this.vacationList.length == 1) tmp = this.calcOtherTime()

      this.$log(tmp, 'tmp')
      if (tmp) {
        this.vacationList = tmp
        vacationDetail.data.list = tmp

        uni.setStorageSync(VACATIONDETAIL, vacationDetail)
      }

      this.$log(this.vacationList, 'this.vacationList1')
      // this.vacationList = Object.assign([], this.vacationList)

      this.sortVacList()
    },
    initVacData() {
      uni.showLoading({
        title: '加载中',
      })
      setTimeout(() => {
        uni.hideLoading()

        this.initVacList()

        // console.log('Vacation:', Vacation)
        // this.vacationList = Vacation && Vacation.data && Vacation.data.list

        this.vacationList.forEach((item) => {
          item.show = false // 挂载新对象用于SwiperAction
        })

        // this.vacationList = []
      }, 1000)
    },

    initEvent() {
      const self = this

      if (this.isListened) return
      uni.$on('refreshVacDetailAction', () => {
        self.$showLoadding(self)
        setTimeout(() => {
          self.$hideLoadding(self)
          self.initVacList()
          self.$log('刷新数据', 'initEvent111')
        }, 2100)
      })
      this.isListened = true
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

  .plug {
    .empty {
      min-height: 60vh;
      display: flex;
      flex-direction: column;
      justify-content: center;
    }

    .pop-content-wrapper {
      padding: 0 30rpx;

      .form {
        .item {
        }
      }

      .btn {
        color: $wm-bg-fff;
        color: rgba(249, 248, 239, 1);
        // background-color: rgba(160, 11, 9,1);
        // background-image: radial-gradient(rgba(160, 11, 9,1), rgba(214, 128, 63,1));
        background-image: linear-gradient(+90deg, rgba(160, 11, 9, 1), rgba(255, 128, 63, 1));
        margin-top: 60rpx;
      }
    }
  }
}
</style>
