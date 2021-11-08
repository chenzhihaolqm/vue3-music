<template>
<div class="search-input">
  <i class="icon-search"></i>
  <input v-model="query" class="inner-input" :placeholder="placeholder"/>
  <i v-show="query" class="icon-dismiss" @click="clear"></i>
</div>
</template>
<script>
import { debounce } from 'throttle-debounce'
export default {
  props: {
    modelValue: String,
    placeholder: {
      type: String,
      default: '搜索歌曲、歌手'
    }
  },
  data () {
    return {
      query: this.modelValue
    }
  },
  methods: {
    clear () {
      this.query = ''
    }
  },
  created () {
    this.$watch('query', debounce(300, (newVal) => {
      this.$emit('update:modelValue', newVal)
    }))
    this.$watch('modelValue', (newVal) => {
      this.query = newVal
    })
  }
}
</script>
<style lang="scss" scoped>
.search-input{
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 32px;
  padding: 0 6px;
  border-radius: 6px;
  background-color: $color-highlight-background;
  .inner-input{
    flex: 1;
    line-height: 16px;
    margin: 0 5px;
    outline: 0;
    font-size: $font-size-medium;
    color: $color-text;
    background-color: $color-highlight-background;
  }
  .icon-dismiss{
    font-size: $font-size-medium-x;
    color: $color-text-d;
  }
}
</style>
