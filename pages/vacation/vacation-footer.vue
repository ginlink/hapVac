<template>
  <view class="vac-footer">
    <u-button class="button" :plain="true" :custom-style="customStyle" @click="$emit('action', 1)">我要续假</u-button>
    <u-button class="button" type="primary" @click="$emit('action', 2)">我要销假</u-button>
  </view>
</template>

<script>
export default {
  data() {
    return {
      customStyle: {
        // marginTop: '20px', // 注意驼峰命名，并且值必须用引号包括，因为这是对象
        color: '#007AFF',
      },
    }
  },
  methods: {},
}
</script>

<style lang="scss" scoped>
.vac-footer {
  position: fixed;
  bottom: 0;
  background-color: #fff;

  display: flex;
  bottom: 0;
  width: 100%;
  padding: 0 40rpx;

  padding-bottom: constant(safe-area-inset-bottom);
  padding-bottom: env(safe-area-inset-bottom);

  .button {
    flex: 1;
    padding: 0;
  }
  .button:first-child {
    margin-right: 15rpx;
  }
  .button:last-child {
    margin-left: 15rpx;
  }
}
</style>
