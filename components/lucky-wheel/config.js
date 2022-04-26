export const prizeList = [
  {
    id: 1,
    icon: require("@/static/lucky/day_+7.png"), // 奖品图片
    name: "一等奖", // 奖品名称
    product: '加7天',
    isPrize: 1 // 该奖项是否为奖品
  },
  {
    id: 2,
    icon: require("@/static/lucky/day_+3.png"),
    name: "二等奖",
    product: '加3天',
    isPrize: 1
  },
  {
    id: 3,
    icon: require("@/static/lucky/give_up.png"),
    name: "谢谢参与",
    product: '',
    isPrize: 0
  },
  {
    id: 4,
    icon: require("@/static/lucky/day_+1.png"),
    name: "三等奖",
    product: '加1天',
    isPrize: 1
  },
  {
    id: 5,
    icon: require("@/static/lucky/day_-1.png"),
    name: "四等奖",
    product: '减1天',
    isPrize: 1
  },
  {
    id: 6,
    icon: require("@/static/lucky/day_-3.png"),
    name: "五等奖",
    product: '减3天',
    isPrize: 1
  },
  {
    id: 7,
    icon: require("@/static/lucky/give_up.png"),
    name: "谢谢参与",
    product: '',
    isPrize: 0
  },
  {
    id: 8,
    icon: require("@/static/lucky/day_-7.png"),
    name: "特等奖",
    product: '减7天',
    isPrize: 1
  }
]

export const vacationRules = [
  '1.每日登录后，即可获得一次幸运转转转的机会，仅限当天有效，过期作废；',
  '2.抽奖可以获得7个，3个，1个假日币，也可能会失去7个，3个...假日币；',
  '3.假日币可用于进入请假中心，在没有获取到每日免费名额时使用，抢到免费名额，不扣除假日币，1个假日币=1天。'
]

// export const vacationRules = [
//   '1.每日登录后，即可获得一次幸运大转盘的机会，仅限当天有效，过期作废。2.金币抽奖，每10个金豆可兑换一次大转盘机会。',
//   '2.金币抽奖，每10个金豆可以兑换一次大转盘抽奖机会',
//   '3.所中金豆或积分到【我的账户】中查询。累计达到100金豆及以上，可以兑换相应奖品'
// ]
