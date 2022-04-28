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
  number: [
    {
      required: true,
      message: '请输入学号',
      trigger: ['change', 'blur'],
    },
  ],
  sex: [
    {
      required: true,
      message: '请选择性别',
      trigger: ['change', 'blur'],
    },
  ],
}