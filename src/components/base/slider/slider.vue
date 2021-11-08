<template>
  <div class="slider" ref="rootRef">
    <div class="slider-group">
      <div class="slider-page" v-for="item of sliders" :key="item.id">
        <a :href="item.link">
          <img :src="item.pic" />
        </a>
      </div>
    </div>
    <div class="dots-wrapper">
      <span v-for="(item, index) of sliders" :key="item.id" class="dot" :class="{ active: index === currentPageIndex }"></span>
    </div>
  </div>
</template>
<script>
import { ref } from 'vue'
import useSlider from './use-slider'
export default {
  name: 'slider',
  props: {
    sliders: {
      type: Array,
      default () {
        return []
      }
    }
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  setup () {
    const rootRef = ref(null)
    const { currentPageIndex } = useSlider(rootRef)
    console.log('this', this, currentPageIndex)
    return {
      rootRef,
      currentPageIndex
    }
  }
}
</script>
<style lang="scss" scoped>
.slider {
  min-height: 1px;
  font-size: 0;
  .slider-group{
    position: relative;
    white-space: nowrap;
    overflow: hidden;
    .slider-page{
      display: inline-block;
      a{
        display: block;
        width: 100%;
      }
      img{
        display: block;
        width: 100%;
      }
    }
  }
  .dots-wrapper{
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    bottom: 12px;
    line-height: 12px;
    .dot{
      display: inline-block;
      margin: 0 4px;
      width: 8px;
      height: 8px;
      border-radius: 50%;
      background-color: $color-text-l;
      &.active{
        width: 20px;
        border-radius: 5px;
      }
    }
  }
}
</style>
