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
import { VACATIONDETAIL, FORMATSECOND, FORMATHOUR, FORMATDAY, MAXLENGTH } from '@/common/misc.js'
import { calcTime } from '@/utils/date.js'
// 表单验证规则
const pageOneRules = {
  typeLabel: [
    {
      required: true,
      message: '请选择假条类型',
      trigger: ['blur', 'change'],
    },
  ],
  startTime: [
    {
      required: true,
      message: '请选择开始时间',
      trigger: ['blur', 'change'],
    },
  ],
  endTime: [
    {
      required: true,
      message: '请选择结束时间',
      trigger: ['blur', 'change'],
    },
  ],
  reason: [
    {
      required: true,
      message: '请填写理由',
      trigger: ['blur', 'change'],
    },
  ],
  statusLabel: [
    {
      required: true,
      message: '请选择假条状态',
      trigger: ['blur', 'change'],
    },
  ],

  checkName: [
    {
      required: true,
      message: '请输入审核人（辅导员）',
      trigger: ['blur', 'change'],
    },
  ],
  urgentContactName: [
    {
      required: true,
      message: '请填写紧急联系人',
      trigger: ['blur', 'change'],
    },
  ],
  urgentContactTel: [
    {
      required: true,
      message: '请填写紧急联系电话',
      trigger: ['blur', 'change'],
    },
  ],
}
const pageTwoRules = {
  checkName: [
    {
      required: true,
      message: '请输入审核人（辅导员）',
      trigger: ['blur', 'change'],
    },
  ],
  urgentContactName: [
    {
      required: true,
      message: '请填写紧急联系人',
      trigger: ['blur', 'change'],
    },
  ],
  urgentContactTel: [
    {
      required: true,
      message: '请填写紧急联系电话',
      trigger: ['blur', 'change'],
    },
  ],
}

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
const status = [
  {
    label: '未审核',
    value: '1',
  },
  {
    label: '未通过',
    value: '2',
  },
  {
    label: '已完成',
    value: '3',
  },
  {
    label: '审核通过',
    value: '4',
  },
]
const advices = [
  {
    label: '未审核',
    value: '1',
  },
  {
    label: '未通过',
    value: '2',
  },
  {
    label: '已完成',
    value: '3',
  },
  {
    label: '同意',
    value: '4',
  },
]

export default {
  data() {
    return {
      currentIndex: 1,
      isPassed: false,
      title: '申请假条', // 导航栏标题
      submitTitle: '提交',

      // form
      isInitDetialForm: false,
      isSelectAdvise: false,
      detailForm: {
        checkName: '',

        urgentContactName: '',
        urgentContactTel: '',
      },
      pageTwoRules: pageTwoRules,

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
      vacationDetail: null,
    }
  },
  // onLoad(params) {
  //   try {
  //     this.initData()

  //     const { action, id } = this.$Route.query

  //     if (!action) return

  //     this.action = action
  //     switch (action) {
  //       case 'add':
  //         this.title = '申请假条'
  //         this.submitTitle = '提交'

  //         // 初始化form
  //         let maxId = this.vacationDetail.maxId
  //         let tmp = this.$u.deepClone(this.vacationDetail.data.clone)
  //         tmp.id = ++maxId
  //         this.vacation = tmp
  //         this.freshForm(this.vacation)
  //         // 初始化form

  //         break
  //       case 'edit':
  //         this.title = '续假'
  //         this.submitTitle = '保存'

  //         if (!id) return

  //         this.vacation = this.findVac(id)
  //         this.freshForm(this.vacation)

  //         console.log('[onLoad]vac:', this.vacation)
  //         break
  //     }
  //   } catch (e) {
  //     this.error(e, {
  //       back: true,
  //     })
  //   }
  // },
  onReady() {
    this.$nextTick(function () {
      this.$refs.uForm.setRules(this.pageOneRules)
    })
  },
  onLoad() {
    const { action, id } = this.$Route.query

    console.log('[created](this.$Route):', this.$Route)

    if (!action) return

    //保留状态
    this.action = action

    if (action == 'add') {
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
      if (!id) {
        return uni.showToast({
          title: '未知错误',
          icon: 'error',
          mask: true,
        })
      }
      /**
       * "apply_time": "2021-11-05T05:09:26.000Z",
        "start_time": "2021-11-05T05:09:26.000Z",
        "end_time": "2021-11-05T05:09:26.000Z",
        "type": null,
        "reason": null,
        "is_tell_parent": false,
        "is_leave_school": true,
        "urgent_name": null,
        "urgent_tel": null,
        "other": null,
        "check_name": null,
        "check_time": "2021-11-05T05:09:26.000Z",
        "status": "pass",
       */

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

          // this.form.type = data.type
          // this.form.typeLabel = types.find((item) => item.value == data.type)?.label
          // this.form.startTime = data.start_time
          // this.form.endTime = data.end_time
          // this.form.reason = data.reason
          // this.form.isTellParent = data.is_tell_parent
          // this.form.isLeaveSchool = data.is_leave_school
          // this.form.status = data.status
          // this.form.statusLabel = status.find((item) => item.value == data.status)?.label
          // this.form.checkName = data.check_name
          // this.form.urgentContactName = data.urgent_name
          // this.form.urgentContactTel = data.urgent_tel
        })
        .catch((err) => console.log('[/api/vacation](err):', err))
    } else {
      uni.showToast({
        title: '未知错误',
        icon: 'error',
        mask: true,
      })
    }
  },

  methods: {
    pickerAction(action) {
      switch (action) {
        case 1:
          // 审核意见
          this.isSelectAdvise = true
          break
      }
    },
    // form
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

    // 工具函数
    warning(msg, params = {}, callback = '') {
      this.toast(msg, 'warning', params, callback)
    },
    error(msg, params = {}, callback = '') {
      this.toast(msg, 'error', params, callback)
    },
    success(msg, params = {}, callback = '') {
      this.toast(msg, 'success', params, callback)
    },
    toast(msg, type, params, callback) {
      this.$nextTick(function () {
        this.$refs.uToast.show({
          title: msg,
          type,
          // url: '',
          params,
          callback,
        })
      })
    },
    // 工具函数

    getLastIdIndex() {
      this.freshVacDetail()
      let list = this.vacationDetail.data.list
      let len = list.length

      return {
        id: list[len - 1].id,
        index: len - 1,
      }
    },
    getIndex(id) {
      let res = -1
      this.vacationDetail.data.list.find((item, index) => {
        res = index
        return item.id == id
      })
      return res
    },
    findVac(id) {
      return this.vacationDetail.data.list.find((item) => {
        return id == item.id
      })
    },
    sortVacList(vacations) {
      // 根据时间排序
      // 开始时间

      vacations.sort((a, b) => {
        let aTime = this.$dayjs(a.detail.startTime, FORMATSECOND).unix()
        let bTime = this.$dayjs(b.detail.startTime, FORMATSECOND).unix()

        return bTime - aTime
      })

      return vacations
    },

    save() {
      this.vacationDetail.data.list = this.sortVacList(this.vacationDetail.data.list)

      if (this.vacationDetail.data.list.length >= MAXLENGTH) {
        let poped = this.vacationDetail.data.list.pop() // 弹出最后一个元素
        this.$log(poped)
      }

      uni.setStorageSync(VACATIONDETAIL, this.vacationDetail)
    },
    saveVac(index, vac) {
      this.vacationDetail.data.list[index] = vac
      this.save()
    },

    freshVacDetail() {
      this.vacationDetail = uni.getStorageSync(VACATIONDETAIL) // 更新数据
    },
    freshVac(form, type = '') {
      // 处理特殊，值引用
      this.vacation.detail.status = parseInt(this.form.status)

      return this.vacation
    },
    freshForm(vac) {
      // 处理相同
      this.form = vac.detail

      this.form.status = vac.detail.status
      switch (this.form.status) {
        case 0:
          this.form.statusLabel = '未审核'
          break
        case 1:
          this.form.statusLabel = '未通过'
          break
        case 2:
          this.form.statusLabel = '已完成'
          break
        case 3:
          this.form.statusLabel = '审核通过'
          break
      }
      return this.form
    },

    submit() {
      // [提交]
      let isPassed = false

      this.$refs.uForm.validate((valid) => {
        if (valid) {
          isPassed = true
          this.$log('验证通过', '验证')
          this.$log(this.form, 'form')
        } else {
          console.log('验证失败')
        }
      })

      // if (!isPassed1 || !isPassed2) return
      if (!isPassed) return
      if (!this.isLookNext) {
        return uni.showToast({
          title: '请瞥一眼下一步',
          icon: 'error',
          mask: true,
        })
      }

      const self = this
      switch (this.action) {
        case 'add':
          // 修改数据，检查时间和申请时间
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

          // this.vacationDetail.data.list.push(this.vacation)
          // this.vacationDetail.maxId++
          // this.save()

          // uni.$emit('refreshVacDetailAction')

          // this.success('创建成功，假条编号为：' + this.vacation.id, {}, () => {
          //   uni.navigateBack({})
          // })
          break
        case 'edit':
          console.log('[edited]vac:', this.vacation)
          let edittmp = this.freshVac(this.form)

          edittmp = actionCalcTime(edittmp)
          let editindex = this.getIndex(edittmp.id)

          debugger

          this.saveVac(editindex, edittmp)

          uni.$emit('refreshVacDetailAction')

          this.success('续假成功！', {}, () => {
            uni.navigateBack({})
          })
          break
      }

      // function actionCalcTime(startTime) {
      //   const times = calcTime(startTime)

      //   vac.detail.checkTime = times.checkTime
      //   vac.detail.applyTime = times.applyTime
      //   return vac
      // }
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
      // console.log('eTimeConfirm-params:', params);
      // this.form.endTime = params.year + '-' + params.month + '-' + params.day + ' ' + params.hour + ':' + params.minute + params.second

      let res = this.formatDate(params)
      // console.log('res:', res);
      this.form.endTime = res
    },
    statusConfirm(params) {
      this.form.statusLabel = params && params[0] && params[0].label
      this.form.status = params && params[0] && params[0].value
    },
    formatDate(params) {
      console.log('day:', params.day)

      const d = new Date(params.year, params.month - 1, params.day, params.hour, params.minute)
      return this.$dayjs(d).format(FORMATSECOND)
    },
    // picker时间和select回调

    typeSelect() {
      this.isTypeSelected = true
    },
    sTimeSelect() {
      this.isStartTimeSelected = true
    },
    eTimeSelect() {
      this.isEndTimeSelected = true
    },

    commit() {
      console.log('请假成功')
      // 整合数据
      let currentVacInfo = {
        type: this.type,
        startTime: this.startTime,
        endTime: this.endTime,
        reason: this.reason,
        isTellParent: this.isTellParent,
        isLeaveSchool: this.isLeaveSchool,
      }

      console.log('currentVacInfo:', currentVacInfo)
      // 更新数据

      this.$Router.push('/pages/vacation/index')
    },
    confirm(e) {
      console.log('e:', e)
    },

    initData() {
      this.vacationDetail = uni.getStorageSync(VACATIONDETAIL)
      // console.log('vacationDetail:', this.vacationDetail);
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
