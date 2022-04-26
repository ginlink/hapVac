// 表单验证规则
export const pageOneRules = {
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
export const pageTwoRules = {
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
