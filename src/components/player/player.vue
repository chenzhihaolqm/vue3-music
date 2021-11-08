<template>
  <div class="player" v-show="playlist.length">
    <transition name="normal" @enter="enter" @after-enter="afterEnter" @leave="leave" @after-leave="afterLeave">
      <div class="normal-player" v-show="fullScreen">
        <div class="background">
          <img :src="currentSong.pic" />
        </div>
        <div class="top">
          <div class="back" @click="goBack">
            <i class="icon-back"></i>
          </div>
          <div class="title">{{currentSong.name}}</div>
          <div class="subtitle">{{currentSong.singer}}</div>
        </div>
        <div class="middle" @touchstart.prevent="onMiddleTouchStart" @touchmove.prevent="onMiddleTouchMove" @touchend.prevent="onMiddleTouchEnd">
          <div class="middle-l" :style="middleLStyle">
            <div class="cd-wrapper" >
              <div class="cd" ref="cdRef" >
                <img :src="currentSong.pic" ref="cdImageRef" :class="cdCls" />
              </div>
            </div>
            <div class="playing-lyric-wrapper">
              <div class="playing-lyric">{{playingLyric}}</div>
            </div>
          </div>
          <scroll class="middle-r" :style="middleRStyle" ref="lyricWrapperRef">
            <div class="lyric-wrapper">
              <div v-if="currentLyric" ref="lyricListRef">
                <p v-for="(item, index) of currentLyric.lines" :key="item.time"
                  class="text"
                  :class="{'current': currentLineNum ===index}">
                  {{item.txt}}
                </p>
              </div>
            </div>
          </scroll>
        </div>
        <div class="bottom">
          <div class="dot-wrapper">
            <span class="dot" :class="{active: currentShow === 'cd' }"></span>
            <span class="dot" :class="{active: currentShow === 'lyric' }"></span>
          </div>
          <div class="progress-wrapper">
            <div class="time time-left">{{formatTime(currentTime)}}</div>
            <div class="progress-bar-wrapper">
              <progress-bar ref="barRef" :progress="progress" @progress-changing="onProgressChanging" @progress-changed="onProgressChanged"></progress-bar>
            </div>
            <div class="time time-right">{{formatTime(currentSong.duration)}}</div>
          </div>
          <div class="operations">
            <div class="icon icon-left">
              <i :class="modeIcon" @click="changeMode"></i>
            </div>
            <div class="icon icon-left" :class="disableCls">
              <i class="icon-prev" @click="onPrev"></i>
            </div>
            <div class="icon icon-center" :class="disableCls">
              <i :class="playIcon" @click="togglePlay"></i>
            </div>
            <div class="icon icon-right" :class="disableCls">
              <i class="icon-next" @click="onNext"></i>
            </div>
            <div class="icon icon-right">
              <i :class="getFavoriteIcon(currentSong)" @click="toggleFavorite(currentSong)"></i>
            </div>
          </div>
        </div>
      </div>
    </transition>
    <mini-player :togglePlay="togglePlay" :progress="progress"></mini-player>
    <audio ref="audioRef" @timeupdate="updateTime" @canplay="ready" @ended="songEnd" ></audio>
  </div>
</template>
<script>
import { useStore } from 'vuex'
import { computed, watch, ref, nextTick } from 'vue'
import Scroll from '@/components/base/scroll/scroll'
import progressBar from './progress-bar'
import miniPlayer from './mini-player'
import { formatTime } from '@/assets/js/util'
import useCd from './use-cd'
import useAnimation from './use-animation'
import useFavorite from './use-favorite'
import useMode from './use-mode'
import ueeLyric from './use-lyric'
import useMiddleInteractive from './use-middle-interactive'
import usePlayHistory from './use-play-history'
import { PLAY_MODE } from '@/assets/js/constant'
export default {
  name: 'player',
  components: {
    Scroll,
    progressBar,
    miniPlayer
  },
  setup () {
    let progressChanging = false
    // data
    const barRef = ref(null)
    const audioRef = ref(null)
    const currentTime = ref(0)
    const songReady = ref(false)
    const store = useStore()
    // computed
    const fullScreen = computed(() => store.state.fullScreen)
    const playlist = computed(() => store.state.playlist)
    const currentSong = computed(() => store.getters.currentSong)
    const playing = computed(() => store.state.playing)
    const playIcon = computed(() => {
      return playing.value ? 'icon-pause' : 'icon-play'
    })
    const disableCls = computed(() => {
      return songReady.value ? '' : 'disabled'
    })
    const progress = computed(() => {
      // console.log('progress', currentTime.value, currentSong.value.duration, (currentTime.value / currentSong.value.duration))
      return (currentTime.value / currentSong.value.duration)
    })
    console.log('currentSong', currentSong, playlist)
    // hook
    const { cdCls, cdRef, cdImageRef } = useCd()
    const { enter, afterEnter, leave, afterLeave } = useAnimation(cdRef)
    const { getFavoriteIcon, toggleFavorite } = useFavorite()
    const { modeIcon, changeMode } = useMode()
    const { lyricWrapperRef, lyricListRef, currentLyric, currentLineNum, playingLyric, playLyric, stopLyric } = ueeLyric({ songReady, currentTime })
    const { middleLStyle, middleRStyle, currentShow, onMiddleTouchStart, onMiddleTouchMove, onMiddleTouchEnd } = useMiddleInteractive()
    const { savePlay } = usePlayHistory()
    // watch
    watch(currentSong, (newSong) => {
      if (!newSong.id || !newSong.url) {
        return
      }
      currentTime.value = 0
      songReady.value = false
      const audio = audioRef.value
      audio.src = newSong.url
      audio.play()
      store.commit('setPlayingState', true)
    })
    watch(playing, (newPlaying) => {
      if (!songReady.value) {
        return
      }
      const audio = audioRef.value
      if (newPlaying) {
        audio.play()
        playLyric()
      } else {
        audio.pause()
        stopLyric()
      }
    })
    watch(fullScreen, async (newFullScreen) => {
      if (newFullScreen) {
        await nextTick()
        barRef.value.setOffset(progress.value)
      }
    })
    // function
    function goBack () {
      store.commit('setFullScreen', false)
    }
    function togglePlay () {
      if (!songReady.value) {
        return
      }
      const playingVal = playing.value
      store.commit('setPlayingState', !playingVal)
    }
    function ready () {
      if (songReady.value) {
        return
      }
      songReady.value = true
      playLyric()
      savePlay(currentSong.value)
    }
    function updateTime (e) {
      if (progressChanging) {
        return
      }
      currentTime.value = e.target.currentTime
    }
    function songEnd () {
      if (store.state.playMode === PLAY_MODE.loop) {
        loop()
      } else {
        onNext()
      }
    }
    function onProgressChanging (progress) {
      progressChanging = true
      currentTime.value = currentSong.value.duration * progress
      playLyric()
      stopLyric()
    }
    function onProgressChanged (progress) {
      progressChanging = false
      const cur = currentTime.value = currentSong.value.duration * progress
      audioRef.value.currentTime = cur
      playLyric()
      store.commit('setPlayingState', true)
    }
    function onPrev () {
      const songLength = playlist.value.length
      if (!songReady.value || !songLength) {
        return
      }
      const currentIndex = store.state.currentIndex
      const nextIndex = (songLength + currentIndex - 1) % songLength
      console.log('prev', songLength, currentIndex, nextIndex)
      store.commit('setCurrentIndex', nextIndex)
    }
    function onNext () {
      const songLength = playlist.value.length
      if (!songReady.value || !songLength) {
        return
      }
      if (songLength === 1) {
        loop()
      } else {
        const currentIndex = store.state.currentIndex
        const nextIndex = (currentIndex + 1) % songLength
        console.log('next', songLength, currentIndex, nextIndex)
        store.commit('setCurrentIndex', nextIndex)
      }
    }
    function loop () {
      const audio = audioRef.value
      audio.currentTime = 0
      audio.play()
      store.commit('setPlayingState', true)
    }
    return {
      // data
      barRef,
      audioRef,
      currentTime,
      // computed
      fullScreen,
      playlist,
      currentSong,
      disableCls,
      playIcon,
      progress,
      // hook
      cdRef,
      cdImageRef,
      cdCls,
      enter,
      afterEnter,
      leave,
      afterLeave,
      getFavoriteIcon,
      toggleFavorite,
      modeIcon,
      changeMode,
      currentLyric,
      playingLyric,
      currentLineNum,
      lyricWrapperRef,
      lyricListRef,
      middleLStyle,
      middleRStyle,
      currentShow,
      onMiddleTouchStart,
      onMiddleTouchMove,
      onMiddleTouchEnd,
      // function
      goBack,
      togglePlay,
      ready,
      updateTime,
      formatTime,
      songEnd,
      onProgressChanging,
      onProgressChanged,
      onPrev,
      onNext
    }
  }
}
</script>
<style lang="scss" scoped>
  .player{
    .normal-player{
      position: fixed;
      top: 0;
      left: 0;
      bottom: 0;
      right: 0;
      z-index: 1;
      background-color: $color-background;
      .background{
        position: absolute;
        top: 0;
        left: 0;
        width:100%;
        height: 100%;
        opacity: .6;
        filter: blur(20px);
        img{
          width:100%;
          height: 100%;
        }
      }
      .top{
        position: relative;
        .back{
          position: absolute;
          left: 6px;
          top: 0px;
          z-index: 20;
          .icon-back{
            display: inline-block;
            padding: 10px;
            font-size: $font-size-large-x;
            color: $color-theme;
            transform: rotate(-90deg);
          }
        }
        .title{
          width: 80%;
          line-height: 40px;
          margin: 0 auto;
          font-size: $font-size-large;
          @include no-wrap();
          color: $color-text;
          text-align: center;
        }
        .subtitle{
          line-height: 20px;
          font-size: $font-size-medium;
          color: $color-text;
          text-align: center;
        }
      }
      .middle{
        position: fixed;
        top: 80px;
        bottom: 170px;
        width: 100%;
        font-size: 0;
        white-space: nowrap;
        .middle-l{
          display: inline-block;
          width: 100%;
          height: 100%;
          .cd-wrapper{
            position: relative;
            width: 100%;
            height: 0;
            padding-top: 80%;
            .cd{
              position: absolute;
              top: 0;
              left: 10%;
              width: 80%;
              height: 100%;
              img{
                width: 100%;
                height: 100%;
                box-sizing: border-box;
                border-radius: 50%;
                border: 10px solid rgba(255, 255, 255, 0.1);
              }
              .playing{
                animation: rotate 20s linear infinite;
              }
            }
          }
          .playing-lyric-wrapper {
            width: 80%;
            margin: 30px auto 0 auto;
            overflow: hidden;
            text-align: center;
            .playing-lyric {
              height: 20px;
              line-height: 20px;
              font-size: $font-size-medium;
              color: $color-text-l;
            }
          }
        }
        .middle-r{
          display: inline-block;
          width: 100%;
          height: 100%;
          vertical-align: top;
          text-align: center;
          overflow: hidden;
          .lyric-wrapper{
            width: 80%;
            margin: 0 auto;
            overflow: hidden;
            .text{
              line-height: 32px;
              font-size: $font-size-medium;
              color: $color-text-l;
              &.current{
                color: $color-text;
              }
            }
          }
        }
      }
      .bottom{
        position: absolute;
        bottom: 50px;
        width: 100%;
        .dot-wrapper{
          font-size: 0;
          text-align: center;
          .dot{
            display: inline-block;
            width: 8px;
            height: 8px;
            margin: 0 4px;
            background: $color-text-ll;
            border-radius: 50%;
            vertical-align: middle;
            &.active{
              width: 20px;
              border-radius: 5px;
            }
          }
        }
        .progress-wrapper{
          display: flex;
          width: 80%;
          margin: 0 auto;
          padding: 10px 0;
          text-align: center;
          .progress-bar-wrapper{
            flex: 1;
            height: 30px;
          }
          .time{
            width: 40px;
            line-height: 30px;
            font-size: $font-size-small;
            color: $color-text;
          }
        }
        .operations{
          display: flex;
          align-items: center;
          .icon{
            flex: 1;
            font-size: 30px;
            color: $color-theme;
            &.disabled{
              color: $color-theme-d;
            }
          }
          .icon-left{
            text-align: right;
          }
          .icon-center{
            font-size: 40px;
            padding: 0 20px;
            text-align: center;
          }
          .icon-right{
            text-align: left;
          }
          .icon-favorite {
            color: $color-sub-theme;
          }
        }
      }
      &.normal-enter-active, &.normal-leave-active{
        transition: all .6s;
        .top, .bottom{
          transition: all .6s cubic-bezier(0.45, 0, 0.55, 1);
        }
      }
      &.normal-enter-from, &.normal-leave-to{
        opacity: 0;
        .top{
          transform: translate3d(0, -100px, 0);
        }
        .bottom{
          transform: translate3d(0, 100px, 0);
        }
      }
    }
  }
</style>
