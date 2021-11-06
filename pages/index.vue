<template>
  <view class="index">
    <!-- <stu-center v-if="startPage.indexOf('pages/student-center/index') != -1 && isValid" /> -->
    <stu-center />
    <!-- <console /> -->
  </view>
</template>

<script>
import StuCenter from './student-center/index.vue'
import Console from './console/index.vue'

export default {
  components: {
    StuCenter,
    Console,
  },
  data() {
    return {
      startPage: '',
    }
  },
  created() {
    this.startPage = '/pages/student-center/index'
  },
  computed: {},
  methods: {},
}
</script>

<style lang="scss" scoped>
.index {
}
</style>
