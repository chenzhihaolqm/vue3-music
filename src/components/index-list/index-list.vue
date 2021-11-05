<template>
  <scroll class="index-list" :probe-type="3" @scroll="handleScroll" ref="scrollRef">
    <div ref="groupRef">
      <div v-for="(group, index) of singers" :key="index" class="group">
        <h2 class="singer-title">{{group.title}}</h2>
        <div v-for="item of group.list" :key="item.id" class="item" @click="selectSinger(item)">
          <div class="avatar">
            <img width="50" height="50" v-lazy="item.pic" />
          </div>
          <div class="name">
            {{item.name}}
          </div>
        </div>
      </div>
    </div>
    <div class="fixed" :style="fixedStyle">
      <div class="fixed-title">{{fixedTitle}}</div>
    </div>
    <div class="shortcut"
      @touchstart="onShortcutTouchStart"
      @touchmove="onShortcutTouchMove"
      @touchend.stop.prevent
    >
      <ul>
        <li v-for="(item, index) of shortcutList" :key="item" :data-index="index" class="short-item"
        :class="{ current: index == currentIndex }">
          {{item}}
        </li>
      </ul>
    </div>
  </scroll>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll'
import useFixed from './use-fixed'
import useShortcut from './use-shortcut'
export default {
  name: 'indexList',
  components: {
    Scroll
  },
  props: {
    singers: {
      type: Array,
      default () {
        return []
      }
    }
  },
  emits: ['select'],
  methods: {
    selectSinger (singer) {
      this.$emit('select', singer)
    }
  },
  setup (props) {
    const { groupRef, fixedTitle, fixedStyle, currentIndex, handleScroll } = useFixed(props)
    const { scrollRef, shortcutList, onShortcutTouchStart, onShortcutTouchMove } = useShortcut(props, groupRef)
    return {
      // fixed
      groupRef,
      fixedTitle,
      fixedStyle,
      currentIndex,
      handleScroll,
      // shortcut
      scrollRef,
      shortcutList,
      onShortcutTouchStart,
      onShortcutTouchMove
    }
  }
}
</script>
<style lang="scss" scoped >
  .index-list{
    position: relative;
    width: 100%;
    height: 100%;
    overflow: hidden;
    .group{
      .singer-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background-color: $color-highlight-background;;
      }
      .item{
        display: flex;
        align-items: center;
        padding: 20px 0 0 30px;
        .avatar{
          width:50px;
          margin-right: 10px;
          img{
            border-radius: 50%;
          }
        }
        .name{
          padding-left: 20px;
          font-size: $font-size-medium;
          color: $color-text-l
        }
      }
    }
    .fixed{
      position: absolute;
      left: 0;
      top: -1px;
      width: 100%;
      .fixed-title{
        height: 30px;
        line-height: 30px;
        padding-left: 20px;
        font-size: $font-size-small;
        color: $color-text-l;
        background-color: $color-highlight-background;;
      }
    }
    .shortcut{
      position: absolute;
      right: 8px;
      top: 50%;
      transform: translateY(-50%);
      width: 20px;
      padding: 20px 0;
      text-align: center;
      font-size: $font-size-small;
      color: $color-text-l;
      ul{
        display: inline-block;
      }
      .short-item{
        display: inline-block;
        padding: 3px;
        line-height: 1;
        &.current{
          color: $color-theme;
        }
      }
    }
  }
</style>
