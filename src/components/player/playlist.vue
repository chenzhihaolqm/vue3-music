<template>
  <teleport to="body">
    <transition name="list-fade" >
      <div class="playlist" v-show="visible && playlist.length" @click="hide" >
        <div class="list-wrapper" @click.stop>
          <div class="list-header">
            <h1 class="title">
              <i class="icon" :class="modeIcon" @click="changeMode"></i>
              <span class="text">{{modeText}}</span>
              <span class="clear" @click="showConfirm">
                <i class="icon-clear"></i>
              </span>
            </h1>
          </div>
          <scroll ref="scrollRef" class="list-content">
            <transition-group  ref="listRef" name="list" tag="ul">
              <li v-for="song of sequenceList" :key="song.id" class="item" @click="selectItem(song)">
                <i class="current" :class="getCurrentIcon(song)"></i>
                <span class="text">{{song.name}}</span>
                <span class="favorite" @click.stop="toggleFavorite(song)">
                  <i :class="getFavoriteIcon(song)"></i>
                </span>
                <span class="delete" @click.stop="removeSong(song)">
                  <i class="icon-delete" :class="{disable: removing}"></i>
                </span>
              </li>
            </transition-group>
          </scroll>
          <div class="list-add">
            <div class="add" @click="showAddSong">
              <i class="icon-add"></i>
              <span class="text">添加歌曲到队列</span>
            </div>
          </div>
          <div class="list-footer" @click="hide">
            <span>关闭</span>
          </div>
        </div>
        <confirm ref="confirmRef"
          text="是否清空播放列表"
          confirm-btn-text="清空"
          @confirm="clearPlayList"
        ></confirm>
        <add-song ref="addSongRef"></add-song>
      </div>
    </transition>
  </teleport>
</template>
<script>
import { ref, computed, watch, nextTick } from 'vue'
import { useStore } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'
import Confirm from '@/components/base/confirm/confirm'
import AddSong from '@/components/add-song/add-song'
import useMode from './use-mode'
import useFavorite from './use-favorite'

export default {
  name: 'playlist',
  components: {
    Scroll,
    Confirm,
    AddSong
  },
  setup () {
    const store = useStore()
    const visible = ref(false)
    const removing = ref(false)
    const confirmRef = ref(null)
    const scrollRef = ref(null)
    const listRef = ref(null)
    const addSongRef = ref(null)
    // computed
    const playlist = computed(() => store.state.playlist)
    const sequenceList = computed(() => store.state.sequenceList)
    const currentSong = computed(() => store.getters.currentSong)
    // watch
    watch(currentSong, async (newSong) => {
      if (!visible.value || !newSong.id) {
        return
      }
      await nextTick()
      scrollToCurrent()
    })
    // hook
    const { modeIcon, modeText, changeMode } = useMode()
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    // function
    async function show () {
      visible.value = true
      await nextTick()
      refreshScroll()
      scrollToCurrent()
    }
    function hide () {
      visible.value = false
    }
    function selectItem (song) {
      const index = playlist.value.findIndex(item => item.id === song.id)
      store.commit('setCurrentIndex', index)
      store.commit('setPlayingState', true)
    }
    function showConfirm () {
      confirmRef.value.show()
    }
    function clearPlayList () {
      store.dispatch('clearSongList')
      hide()
    }
    function getCurrentIcon (song) {
      if (currentSong.value.id === song.id) {
        return 'icon-play'
      }
    }
    function removeSong (song) {
      console.log('removeSong', song)
      if (removing.value) {
        return
      }
      store.dispatch('removeSong', song)
      if (!playlist.value.length) {
        hide()
      }
      removing.value = true
      setTimeout(() => {
        removing.value = false
      }, 300)
    }
    function showAddSong () {
      addSongRef.value.show()
    }
    function refreshScroll () {
      scrollRef.value.scroll.refresh()
    }
    function scrollToCurrent () {
      const index = sequenceList.value.findIndex(item => item.id === currentSong.value.id)
      if (index === -1) {
        return
      }
      const target = listRef.value.$el.children[index]
      scrollRef.value.scroll.scrollToElement(target, 300)
    }
    return {
      visible,
      removing,
      confirmRef,
      scrollRef,
      listRef,
      addSongRef,
      // computed
      playlist,
      sequenceList,
      // hook
      modeIcon,
      modeText,
      getFavoriteIcon,
      toggleFavorite,
      changeMode,
      // function
      show,
      hide,
      selectItem,
      showConfirm,
      clearPlayList,
      getCurrentIcon,
      removeSong,
      showAddSong
    }
  }
}
</script>
<style lang="scss" scoped>
.playlist{
  position: fixed;
  top: 0;
  bottom: 0;
  width: 100%;
  z-index: 200;
  background-color: $color-background-d;
  &.list-fade-enter-active, &.list-fade-leave-active{
    transition: opacity 1.3s;
    .list-wrapper{
      transition: all 1.3s;
    }
  }
  &.list-fade-enter-from, &.list-fade-leave-to{
    opacity: 0;
    // .list-wrapper{
    //   transform: translate(0, 100%)
    // }
  }
  .list-wrapper{
    position: absolute;
    bottom: 0;
    width: 100%;
    z-index: 210;
    background-color: $color-highlight-background;
    .list-header{
      padding: 20px;
      .title{
        display: flex;
        align-items: center;
        .icon{
          font-size: 24px;
          margin-right:10px;
          color: $color-theme-d;
        }
        .text{
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-l;
        }
        .clear{
          @include extend-click();
          .icon-clear{
            font-size: $font-size-medium;
            color: $color-text-d;
          }
        }
      }
    }
    .list-content{
      max-height: 240px;
      overflow: hidden;
      .item{
        display: flex;
        align-items: center;
        height: 40px;
        padding: 0 20px;
        .current{
          flex: 0 0 20px;
          width: 20px;
          font-size: $font-size-small;
          color: $color-theme-d;
        }
        .text{
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          @include no-wrap()
        }
        .favorite{
          @include extend-click();
          margin-right: 15px;
          font-size: $font-size-small;
          color: $color-theme;
        }
        .delete{
          @include extend-click();
          font-size: $font-size-small;
          color: $color-theme;
          .disable {
            color: $color-theme-d;
          }
        }
      }
    }
    .list-add {
      width: 140px;
      margin: 20px auto;
      .add {
        display: flex;
        align-items: center;
        padding: 8px 16px;
        border: 1px solid $color-text-l;
        border-radius: 100px;
        color: $color-text-l;
        .icon-add {
          margin-right: 5px;
          font-size: $font-size-small-s;
        }
        .text {
          font-size: $font-size-small;
        }
      }
    }
    .list-footer{
      line-height: 50px;
      text-align: center;
      font-size: $font-size-medium-x;
      background-color: $color-background;
      color: $color-text-l;
    }
  }
}
</style>
