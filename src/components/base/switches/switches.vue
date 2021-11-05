<template>
  <ul class="switches">
    <li v-for="(item, index) of items" :key="item" @click="switchItem(index)"
      class="switch-item" :class="{active: index=== modelValue}">
      {{item}}
    </li>
    <div class="active-bar" :style="activeStyle"></div>
  </ul>
</template>
<script>
export default {
  props: {
    items: {
      type: Array,
      default () {
        return []
      }
    },
    modelValue: Number
  },
  computed: {
    activeStyle () {
      const x = 120 * this.modelValue
      return {
        transform: `translate(${x}px, 0)`
      }
    }
  },
  methods: {
    switchItem (index) {
      this.$emit('update:modelValue', index)
    }
  }
}
</script>
<style lang="scss" scoped>
.switches{
  display: flex;
  position: relative;
  width: 240px;
  margin: 0 auto;
  border-radius: 5px;
  border: 1px solid $color-highlight-background;
  .switch-item{
    flex: 1;
    position: relative;
    z-index: 10;
    line-height: 30px;
    text-align: center;
    font-size: $font-size-medium;
    color: $color-text-d;
    &.active{
      color: $color-text;
    }
  }
  .active-bar{
    position: absolute;
    left: 0;
    top: 0;
    width: 120px;
    height: 30px;
    border-radius: 5px;
    transition: transform .3s;
    background-color: $color-highlight-background;
  }
}
</style>
