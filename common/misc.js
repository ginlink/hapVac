
export const START_PAGE = 'START_PAGE'
export const VERSION = 'VERSION'

export const VACATION_DETAIL = "VACATION_DETAIL"
export const STUDENT_CENTER_MENU = "STUDENT_CENTER_MENU"
export const STUDENT_INFO = "STUDENT_INFO"

export const FORMAT_TO_DAY = "YYYY-MM-DD"
export const FORMAT_TO_HOUR = "YYYY-MM-DD HH"
export const FORMAT_TO_MINUTE = "YYYY-MM-DD HH:mm"
export const FORMAT_TO_SECOND = "YYYY-MM-DD HH:mm:ss"

export const USER_INFO = 'USER_INFO'

// 审核
export const vacationStatus = [
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
// 请假详情页面状态
export const vacationDetailStatus = [
  {
    label: '未审核',
    value: '1',
    color: '#3685F1',
  },
  {
    label: '审批未通过',
    value: '2',
    color: '#ee2222',
  },
  {
    label: '已完成',
    value: '3',
    color: '#3685F1',
  },
  {
    label: '审批通过',
    value: '4',
    color: '#09BA08',
  },
]
// 请假列表页面状态
export const vacationListStatus = [
  {
    label: '未审核',
    value: '1',
    color: '#3685F1',
  },
  {
    label: '未通过',
    value: '2',
    color: '#ee2222',
  },
  {
    label: '已完成',
    value: '3',
    color: '#9b9b9b',
  },
  {
    label: '审批通过',
    value: '4',
    color: '#09BA08',
  },
]
// 审核意见
export const vacationAdvices = [
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

export const default_Student_Info = {
  name: '点击修改信息',
  grade: '',
  icon: ''
}


export const VERSION_NODES = [
  { version: '1.0.0', pieces: ['* 增加请假、销假、续假功能'], updateTime: '2021.10.12 00:29:52' },
  {
    version: '1.1.0', pieces: ['* 增加设置第一启动页面', '* 增加更新日志页面', '* 样式：调整学生中心home图标、修改所有标题居中、调整假条详情样式'], updateTime: '2021-10-13 20:48:45'
  }, {
    version: '1.2.0', pieces: ['* 调整学生中心页面为新样式'], updateTime: '2021-10-30 00:32:29'
  }, {
    version: '1.2.3', pieces: ['* 修复首页白屏问题', '* 缓存数据，加快访问速度'], updateTime: '2021-10-30 19:29:10'
  }, {
    version: '1.2.4', pieces: ['* 增加更新说明弹窗', '* 增加公告功能', '* 适配iPhoneX', '* 调整一些小样式'], updateTime: '2021-11-01 14:45:41'
  }, {
    version: '2.0.0', pieces: ['* 增加登录功能', '* 将假条数据置于数据库', '* 增加每日最大容纳用户数'], updateTime: '2021-11-01 14:45:41'
  }, {
    version: '2.1.0', pieces: ['* 增加电子假条', '* 调整假条列表字体大小'], updateTime: '2022-04-26 23:15:59'
  }, {
    version: '2.1.1', pieces: ['* 增加轮训数据', '* 修复部分样式问题'], updateTime: '2022-04-28 23:25:31'
  },
]
