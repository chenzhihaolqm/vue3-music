<template>
  <div class="progress-bar" @click="handleClick">
    <div class="inner-bar">
      <div ref="progress" class="progress" :style="progressStyle"></div>
      <div class="progress-btn-wrap" :style="btnStyle" @touchstart="onTouchStart"
      @touchmove="onTouchMove" @touchend="onTouchEnd">
        <div class="progress-btn"></div>
      </div>
    </div>
  </div>
</template>
<script>
const progressBtnWidth = 16
export default {
  props: {
    progress: {
      type: Number,
      default: 0
    }
  },
  emits: ['progress-changing', 'progress-changed'],
  data () {
    return {
      offset: 0
    }
  },
  computed: {
    progressStyle () {
      return { width: `${this.offset}px` }
    },
    btnStyle () {
      return { transform: `translateX(${this.offset}px)` }
    }
  },
  watch: {
    progress () {
      this.setOffset(this.progress)
    }
  },
  methods: {
    getMaxBarWidth () {
      const barWidth = this.$el.offsetWidth
      const maxTranslateX = barWidth - progressBtnWidth
      return maxTranslateX
    },
    setOffset (progress) {
      this.offset = this.getMaxBarWidth() * progress
      // console.log(barWidth, progress, this.offset)
    },
    handleClick (e) {
      const offset = e.pageX - this.$el.getBoundingClientRect().x
      const progress = offset / this.getMaxBarWidth()
      this.$emit('progress-changed', progress)
    },
    onTouchStart (event) {
      this.touch.x1 = event.touches[0].pageX
      this.touch.beginWidth = this.offset
    },
    onTouchMove (event) {
      const diff = event.touches[0].pageX - this.touch.x1
      const offset = Math.max(Math.min(this.touch.beginWidth + diff, this.getMaxBarWidth()), 0)
      this.offset = offset
      const progress = offset / this.getMaxBarWidth()
      this.$emit('progress-changing', progress)
    },
    onTouchEnd () {
      const progressWidth = this.$refs.progress.offsetWidth
      const progress = progressWidth / this.getMaxBarWidth()
      this.$emit('progress-changed', progress)
    }
  },
  created () {
    this.touch = {}
  }
}
</script>
<style lang="scss" scoped>
.progress-bar{
  height: 30px;
  .inner-bar{
    position: relative;
    top: 13px;
    height: 4px;
    background-color: $color-background-d;
    .progress{
      height: 100%;
      width: 50%;
      background: $color-theme;
    }
    .progress-btn-wrap{
      position: absolute;
      left: -7px;
      top: -13px;
      width: 30px;
      height: 30px;
      .progress-btn{
        position: absolute;
        left: 7px;
        top: 7px;
        width: 10px;
        height: 10px;
        border-radius: 50%;
        border: 3px solid $color-text;
        background: $color-theme;
      }
    }
  }
}
</style>
