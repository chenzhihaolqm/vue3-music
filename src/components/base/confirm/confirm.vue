<template>
  <teleport to="body">
    <transition name="confirm-fade">
      <div class="confirm" v-show="visible">
        <div class="confirm-wrapper">
          <div class="confirm-content">
            <div class="text">{{text}}</div>
            <div class="operate">
              <div class="operate-btn left" @click="confirm">
                {{confirmBtnText}}
              </div>
              <div class="operate-btn right" @click="cancel">
                {{cancelBtnText}}
              </div>
            </div>
          </div>
        </div>
      </div>
    </transition>
  </teleport>
</template>
<script>
export default {
  props: {
    text: {
      type: String,
      default: ''
    },
    confirmBtnText: {
      type: String,
      default: '确定'
    },
    cancelBtnText: {
      type: String,
      default: '取消'
    }
  },
  data () {
    return {
      visible: false
    }
  },
  emits: ['confirm'],
  methods: {
    confirm () {
      this.hide()
      this.$emit('confirm')
    },
    cancel () {
      this.hide()
    },
    show () {
      this.visible = true
    },
    hide () {
      this.visible = false
    }
  }
}
</script>
<style lang="scss" scoped>
.confirm{
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  z-index: 998;
  background-color: $color-background-d;
  &.confirm-fade-enter-active{
    animation: confirm-fadein .3s;
    .confirm-content{
      animation: confirm-zoom-in .3s;
    }
  }
  &.confirm-fade-leave-active{
    animation: confirm-fadeout .3s;
    .confirm-content{
      animation: confirm-zoom-out .3s;
    }
  }
  .confirm-wrapper{
    position: absolute;
    left: 50%;
    top:50%;
    z-index: 999;
    transform: translate(-50%, -50%);
    .confirm-content{
      width: 270px;
      border-radius: 13px;
      background-color: $color-highlight-background;
      .text{
        padding: 19px 15px;
        line-height: 22px;
        text-align: center;
        font-size: $font-size-large;
        color: $color-text-l;
      }
      .operate{
        display: flex;
        align-items: center;
        text-align: center;
        font-size: $font-size-large;
        .operate-btn{
          flex: 1;
          padding: 10px 0;
          line-height: 22px;
          color: $color-text-l;
          border-top: 1px solid $color-background-d;
          &.left{
           color: $color-text;
           border-right: 1px solid $color-background-d;
          }
        }
      }
    }
  }
}
@keyframes confirm-fadein {
  0% {
    opacity: 0;
  }
  100% {
    opacity: 1;
  }
}
@keyframes confirm-fadeout {
  0% {
    opacity: 1;
  }
  100% {
    opacity: 0;
  }
}
@keyframes confirm-zoom-in {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.1);
  }
  100% {
    transform: scale(1);
  }
}
@keyframes confirm-zoom-out {
  0% {
    transform: scale(1);
  }
  100% {
    transform: scale(0);
  }
}
</style>
