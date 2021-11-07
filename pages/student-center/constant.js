export const infoRules = {
  name: [
    {
      required: true,
      message: '请输入姓名',
      trigger: ['change', 'blur'],
    },
  ],
  yard: [
    {
      required: true,
      message: '请输入院系',
      trigger: ['change', 'blur'],
    },
  ],
  grade: [
    {
      required: true,
      message: '请输入班级',
      trigger: ['change', 'blur'],
    },
  ],
}