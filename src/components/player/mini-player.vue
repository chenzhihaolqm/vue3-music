<template>
  <transition name="mini">
    <div class="mini-player" v-show="!fullScreen" @click="handleToNoramal">
      <div class="cd-wrapper" >
        <div class="cd" ref="cdRef" >
          <img width="40" height="40" :src="currentSong.pic" ref="cdImageRef" :class="cdCls" />
        </div>
      </div>
      <div class="slider-wrapper" ref="sliderWrapperRef">
        <ul class="slider-group">
          <li v-for="song of playlist" :key="song.id" class="slide-page">
            <div class="name">{{song.name}}</div>
            <div class="desc">{{song.singer}}</div>
          </li>
        </ul>
      </div>
      <div class="control" @click.stop="togglePlay">
        <progress-circle :radius="32" :progress="progress">
          <i class="icon-mini" :class="playIcon"></i>
        </progress-circle>
      </div>
      <div class="control" @click.stop="showPlaylist">
        <i class="icon-playlist"></i>
      </div>
      <playlist ref="playlistRef"></playlist>
    </div>
  </transition>
</template>
<script>
import { useStore } from 'vuex'
import { ref, computed } from 'vue'
import Playlist from './playlist'
import useCd from './use-cd'
import useMiniSlider from './use-mini-slider'
import ProgressCircle from './progress-circle'
export default {
  name: 'mini-player',
  components: {
    ProgressCircle,
    Playlist
  },
  props: {
    togglePlay: {
      type: Function
    },
    progress: {
      type: Number
    }
  },
  setup () {
    const store = useStore()
    const playlistRef = ref(null)
    // computed
    const fullScreen = computed(() => store.state.fullScreen)
    const currentSong = computed(() => store.getters.currentSong)
    const playlist = computed(() => store.state.playlist)
    const playing = computed(() => store.state.playing)
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause-mini' : 'icon-play-mini'
    })
    // hook
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { sliderWrapperRef } = useMiniSlider()

    // function
    function handleToNoramal () {
      store.commit('setFullScreen', true)
    }
    function showPlaylist () {
      playlistRef.value.show()
    }
    return {
      playlistRef,
      // computed
      fullScreen,
      currentSong,
      playlist,
      playIcon,
      // hook
      cdCls,
      cdRef,
      cdImageRef,
      sliderWrapperRef,
      // function
      handleToNoramal,
      showPlaylist
    }
  }
}
</script>
<style lang="scss" scoped>
  .mini-player{
    display: flex;
    align-items: center;
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 60px;
    background-color: $color-highlight-background;
    &.mini-enter-active, &.mini-leave-active{
      transition: transform .6s linear;
    }
    &.mini-enter-from, &.mini-leave-to{
      transform: translate3d(0, 100%, 0)
    }
    .cd-wrapper{
      flex: 0 0 40px;
      width: 40px;
      height: 40px;
      padding: 0 10px 0 20px;
      .cd{
        width: 100%;
        height: 100%;
        img{
          border-radius: 50%;
        }
        .playing{
          animation: rotate 20s linear infinite;
        }
      }
    }
    .slider-wrapper{
      flex: 1;
      margin-right: 1px;
      line-height: 20px;
      overflow: hidden;
      .slider-group{
        overflow: hidden;
        white-space: nowrap;
        .slide-page{
          display: inline-block;
          width: 100%;
          .name{
            margin-bottom: 2px;
            font-size: $font-size-medium;
            color: $color-text;
            @include no-wrap()
          }
          .desc{
            font-size: $font-size-small;
            color: $color-text-d;
            @include no-wrap()
          }
        }
      }
    }
    .control{
      flex: 0 0 30px;
      width: 30px;
      padding: 0 10px;
      .icon-playlist{
        font-size: 28px;
        color: $color-theme-d;
      }
      .icon-mini{
        position: absolute;
        top: 0;
        left: 0;
        font-size: 32px;
        color: $color-theme-d;
      }
    }
  }
</style>
