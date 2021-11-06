<template>
  <!-- 申请假条 -->
  <view class="apply-vacation">
    <view class="navbar">
      <u-navbar :title="title" :border-bottom="false" titleColor="#303133" titleBold>
        <!-- #ifndef MP -->
        <view slot="right">
          <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
        </view>
        <!-- #endif -->
      </u-navbar>
    </view>

    <view class="content">
      <u-form :model="form" ref="uForm">
        <view v-if="currentIndex == 1" class="form-wrapper">
          <u-form-item :label-width="labelWidth" label="请假类型" prop="typeLabel">
            <u-input
              v-model="form.typeLabel"
              type="select"
              placeholder="请选择"
              @click="isTypeSelected = !isTypeSelected"
            />
          </u-form-item>
          <u-form-item :label-width="labelWidth" label="开始时间" prop="startTime">
            <u-input
              v-model="form.startTime"
              type="select"
              placeholder="请选择"
              @click="isStartTimeSelected = !isStartTimeSelected"
            />
          </u-form-item>
          <u-form-item :label-width="labelWidth" label="结束时间" prop="endTime">
            <u-input
              v-model="form.endTime"
              type="select"
              placeholder="请选择"
              @click="isEndTimeSelected = !isEndTimeSelected"
            />
          </u-form-item>
          <u-form-item label-position="top" :label-width="labelWidth" label="请假原因" prop="reason">
            <u-input
              v-model="form.reason"
              type="textarea"
              :height="textareaHeight"
              placeholder="样例假条，请修改您想修改的地方"
              auto-height
            />
          </u-form-item>
          <u-form-item :label-width="labelWidth" label="是否告知家长" prop="isTellParent">
            <u-switch class="switch" v-model="form.isTellParent"></u-switch>
          </u-form-item>
          <u-form-item :label-width="labelWidth" label="是否离开学校" prop="isLeaveSchool">
            <u-switch v-model="form.isLeaveSchool"></u-switch>
          </u-form-item>
          <u-form-item :label-width="labelWidth" label="选择假条状态" prop="statusLabel" :border-bottom="false">
            <u-input
              v-model="form.statusLabel"
              type="select"
              placeholder="请选择"
              @click="isPassSelected = !isPassSelected"
            />
          </u-form-item>
        </view>

        <view v-if="currentIndex == 2" class="form-wrapper">
          <view class="page2">
            <u-form-item :label-width="labelWidth" label="审核人(辅导员)" prop="checkName">
              <u-input v-model="form.checkName" type="text" placeholder="请输入审核人" />
            </u-form-item>
            <u-form-item :label-width="labelWidth" label="紧急联系人" prop="urgentContactName">
              <u-input v-model="form.urgentContactName" type="text" placeholder="请填写" />
            </u-form-item>
            <u-form-item :label-width="labelWidth" label="紧急联系电话" prop="urgentContactTel">
              <u-input v-model="form.urgentContactTel" type="text" placeholder="请填写" />
            </u-form-item>
          </view>
        </view>
      </u-form>

      <view class="pagenation">
        <view class="pre">
          <u-button size="mini" :disabled="currentIndex == 1" @click="btnAction(1)">上一步</u-button>
        </view>
        <view class="next">
          <u-button size="mini" :disabled="currentIndex == 2" @click="btnAction(2)">下一步</u-button>
        </view>
      </view>

      <button class="btn" @click="submit">{{ submitTitle }}</button>
    </view>

    <!-- 三个选择器 -->
    <u-select v-model="isTypeSelected" mode="single-column" :list="types" @confirm="typeConfirm"></u-select>
    <u-picker v-model="isStartTimeSelected" mode="time" :params="params" @confirm="sTimeConfirm"></u-picker>
    <u-picker v-model="isEndTimeSelected" mode="time" :params="params" @confirm="eTimeConfirm"></u-picker>
    <u-select
      v-model="isPassSelected"
      mode="single-column"
      :list="status"
      @confirm="statusConfirm"
      :default-value="[3]"
    ></u-select>
  </view>
</template>

<script>
import { FORMAT_TO_SECOND, vacationStatus as status } from '@/common/misc.js'
import { calcTime } from '@/utils/date.js'
import { pageOneRules } from './constant.js'

// form字段
const form = {
  type: 1,
  typeLabel: '',
  startTime: '',
  endTime: '',
  checkTime: '',
  applyTime: '',

  reason: '',
  isTellParent: false,
  isLeaveSchool: true,
  status: '',
  statusLabel: '',

  checkName: '',

  urgentContactName: '',
  urgentContactTel: '',
}

// 状态
const types = [
  {
    label: '事假',
    value: '1',
  },
  {
    label: '病假',
    value: '2',
  },
]

export default {
  data() {
    return {
      currentIndex: 1,
      title: '申请假条', // 导航栏标题
      submitTitle: '提交',

      // form
      textareaHeight: 100,
      labelWidth: '30%',
      pageOneRules: pageOneRules,
      form: form,

      // picker是否显示
      isTypeSelected: false,
      isStartTimeSelected: false,
      isEndTimeSelected: false,
      isPassSelected: false,

      // picker参数
      params: {
        year: true,
        month: true,
        day: true,
        hour: true,
        minute: true,
        second: false,
      },
      types: types,
      status: status,

      action: '',
      vacation: null,
    }
  },
  onReady() {
    this.$nextTick(function () {
      // 注入表单规则
      this.$refs.uForm.setRules(this.pageOneRules)
    })
  },
  onLoad() {
    const { action, id } = this.$Route.query

    console.log('[created](this.$Route):', this.$Route)

    if (!action) return

    //保留状态
    this.currentAction = action
    this.currentId = id

    if (action == 'add') {
      console.log('[onLoad](新增假条):')
      // 生成数据
      const newForm = {
        type: 1,
        typeLabel: types.find((item) => item.value == 1)?.label,
        startTime: '2021-11-05 23:23:07',
        endTime: '2021-11-05 23:23:07',
        reason: '原因',
        isTellParent: false,
        isLeaveSchool: true,
        status: 1,
        statusLabel: status.find((item) => item.value == 1)?.label,
        checkName: '审核人',
        urgentContactName: '紧急联系人',
        urgentContactTel: '138...39',
      }

      console.log('[created](new):', newForm)

      this.form = { ...newForm }
    } else if (action == 'edit') {
      console.log('[onLoad](编辑假条):', id)
      if (!id) {
        return uni.showToast({
          title: '未知错误',
          icon: 'error',
          mask: true,
        })
      }

      // 请求数据
      this.$http
        .get('/api/vacation/' + id)
        .then((res) => {
          const data = res.data

          const newForm = {
            type: data.type,
            typeLabel: types.find((item) => item.value == data.type)?.label,
            startTime: data.start_time,
            endTime: data.end_time,
            reason: data.reason,
            isTellParent: data.is_tell_parent,
            isLeaveSchool: data.is_leave_school,
            status: data.status,
            statusLabel: status.find((item) => item.value == data.status)?.label,
            checkName: data.check_name,
            urgentContactName: data.urgent_name,
            urgentContactTel: data.urgent_tel,
          }

          this.form = { ...newForm }
        })
        .catch((err) => {
          uni.showToast({
            title: '获取假条失败',
            icon: 'error',
            mask: true,
          })
          console.log('[/api/vacation](err):', err)
        })
    } else {
      uni.showToast({
        title: '未知错误',
        icon: 'error',
        mask: true,
      })
    }
  },

  methods: {
    btnAction(action) {
      console.log(action)
      switch (action) {
        case 1:
          // 第一页
          this.currentIndex = 1
          break
        case 2:
          // 第二页
          this.currentIndex = 2
          this.isLookNext = true
          break
      }
    },
    submit() {
      let isPassed = false
      this.$refs.uForm.validate((valid) => {
        console.log('[](valid):', valid)

        if (valid) isPassed = true
      })
      if (!isPassed) return

      if (!this.isLookNext) {
        return uni.showToast({
          title: '请瞥一眼下一步',
          icon: 'error',
          mask: true,
        })
      }

      // 拿到表单数据
      const form = this.form
      const computedTime = calcTime(form.startTime)
      const vacation = {
        apply_time: computedTime.applyTime,
        start_time: form.startTime,
        end_time: form.endTime,
        type: form.type,
        reason: form.reason,
        is_tell_parent: form.isTellParent,
        is_leave_school: form.isLeaveSchool,
        urgent_name: form.urgentContactName,
        urgent_tel: form.urgentContactTel,
        other: form.other,
        check_name: form.checkName,
        check_time: computedTime.checkTime,
        status: form.status,
      }

      // 提交
      switch (this.currentAction) {
        case 'add':
          this.$http
            .post('/api/vacation', vacation)
            .then((res) => {
              uni.showToast({
                title: '创建成功',
                icon: 'success',
                mask: true,
              })

              setTimeout(() => {
                uni.navigateBack({ delta: 1 })
              }, 1000)
            })
            .catch((err) => {
              uni.showToast({
                title: '创建失败',
                icon: 'error',
                mask: true,
              })
              console.log('[/api/vacation](err):', err)
            })
          break
        case 'edit':
          this.$http
            .put(`/api/vacation/${this.currentId}`, vacation)
            .then((res) => {
              uni.showToast({
                title: '更新成功',
                icon: 'success',
                mask: true,
              })

              setTimeout(() => {
                uni.navigateBack({ delta: 1 })
              }, 1000)
            })
            .catch((err) => {
              uni.showToast({
                title: '更新失败',
                icon: 'error',
                mask: true,
              })
              console.log('[/api/vacation](err):', err)
            })

          break
      }
    },

    // picker时间和select回调
    typeConfirm(params) {
      this.form.type = params[0] && params[0].value
      this.form.typeLabel = params[0] && params[0].label
    },
    sTimeConfirm(params) {
      this.form.startTime = this.formatDate(params)
    },
    eTimeConfirm(params) {
      let res = this.formatDate(params)
      this.form.endTime = res
    },
    statusConfirm(params) {
      this.form.statusLabel = params && params[0] && params[0].label
      this.form.status = params && params[0] && params[0].value
    },
    formatDate(params) {
      console.log('day:', params.day)

      const d = new Date(params.year, params.month - 1, params.day, params.hour, params.minute)
      return this.$dayjs(d).format(FORMAT_TO_SECOND)
    },
  },
}
</script>

<style lang="scss" scoped>
.apply-vacation {
  .content {
    .form-wrapper {
      padding: 0 30rpx 0;
      background-color: $wm-bg-fff;
    }

    .btn {
      position: absolute;
      bottom: 0;
      bottom: constant(safe-area-inset-bottom);
      bottom: env(safe-area-inset-bottom);
      left: 0;
      right: 0;
      font-size: 30rpx;
      height: 80rpx;
      line-height: 80rpx;
      color: $wm-bg-fff;
      background-color: $theme-color;
    }

    .pagenation {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 30rpx;

      button {
      }

      .next {
        margin-left: 30rpx;
      }
    }
  }
}
</style>
