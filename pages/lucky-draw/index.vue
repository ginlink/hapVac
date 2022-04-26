<template>
  <view class="lucky-draw">
    <u-navbar
      title="幸运抽抽抽"
      :border-bottom="false"
      :backIconName="backHomeIcon"
      backIconSize="56"
      titleColor="#303133"
      titleBold
    >
      <!-- #ifndef MP -->
      <view slot="right">
        <wechat-menu class="wechat-menu-wrapper"></wechat-menu>
      </view>
      <!-- #endif -->
    </u-navbar>

    <view class="content">
      <lucky-wheel />
    </view>
  </view>
</template>

<script>
import LuckyWheel from '@/components/lucky-wheel/index.vue'

const luckyDrawMenus = [
  { title: '一等奖', stage: 1 },
  { title: '二等奖', stage: 2 },
  { title: '三等奖', stage: 3 },
  { title: '四等奖', stage: 4 },
  { title: '特等奖', stage: 5 },
]
export default {
  components: { LuckyWheel },
  data() {
    return {}
  },
  onLoad() {},
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.index {
}
</style>
