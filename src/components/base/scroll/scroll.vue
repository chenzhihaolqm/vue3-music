<template>
  <div ref="rootRef">
    <slot></slot>
  </div>
</template>
<script>
import { ref } from 'vue'
import useScroll from './use-scroll'
export default {
  name: 'scroll',
  props: {
    click: {
      type: Boolean,
      default: true
    },
    probeType: {
      type: Number,
      default: 0
    }
  },
  data () {
    return {
      activeIndex: 0
    }
  },
  emits: ['scroll'],
  setup (props, { emit }) {
    const rootRef = ref(null)
    const scroll = useScroll(rootRef, props, emit)
    console.log('scroll render')
    return {
      rootRef,
      scroll
    }
  }
}
</script>
