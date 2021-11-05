<template>
  <div class="music-list">
    <div class="back" @click="goBack">
      <i class="icon-back"></i>
    </div>
    <h1 class="title">{{title}}</h1>
    <div class="bg-image" :style="bgImageStyle" ref="bgImage">
      <div class="play-btn-wrapper" :style="playBtnStyle">
        <div
          v-show="songs.length > 0"
          class="play-btn"
          @click="random"
        >
          <i class="icon-play"></i>
          <span class="text">随机播放全部</span>
        </div>
      </div>
      <div class="filter" :style="filterStyle"></div>
    </div>
    <scroll class="list"  :probe-type="3" v-no-result:[noResultText]="noResult"
      @scroll="handleScroll" :style="scrollStyle">
      <song-list :songs="songs" @select="selectSong" :rank="rank"></song-list>
    </scroll>
  </div>
</template>
<script>
import { mapActions } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
const RESERVED_HEIGHT = 40
export default {
  components: {
    Scroll,
    SongList
  },
  props: {
    songs: {
      type: Array,
      default () {
        return []
      }
    },
    noResultText: {
      type: String,
      default: '抱歉，没有找到歌曲'
    },
    loading: Boolean,
    title: String,
    pic: String,
    rank: Boolean
  },
  data () {
    return {
      scrollY: 0,
      maxTranslateY: 0,
      imageHeight: 0
    }
  },
  computed: {
    bgImageStyle () {
      let paddingTop = '70%'
      let zIndex = 0
      let height = 0
      let scale = 1
      if (this.scrollY > this.maxTranslateY) {
        zIndex = 10
        paddingTop = 0
        height = RESERVED_HEIGHT + 'px'
      }
      if (this.scrollY < 0) {
        scale = 1 + (-this.scrollY / this.imageHeight)
      }
      return {
        zIndex,
        paddingTop,
        height,
        transform: `scale(${scale})`,
        backgroundImage: `url('${this.pic}')`
      }
    },
    playBtnStyle () {
      let display = ''
      if (this.scrollY >= this.maxTranslateY) {
        display = 'none'
      }
      return {
        display
      }
    },
    scrollStyle () {
      const bottom = this.$store.state.playlist.length ? '60px' : 0
      return {
        top: `${this.imageHeight}px`,
        bottom
      }
    },
    filterStyle () {
      let blur = 0
      blur = (Math.min(this.scrollY, this.maxTranslateY) / this.imageHeight) * 20
      return {
        backdropFilter: `blur(${blur}px)`
      }
    },
    noResult () {
      return !this.loading && !this.songs.length
    }
  },
  methods: {
    ...mapActions(['selectPlay', 'randomPlay']),
    goBack () {
      this.$router.back()
    },
    handleScroll (page) {
      this.scrollY = -page.y
      // console.log('page.y', -page.y, this.maxTranslateY)
    },
    selectSong (song, index) {
      this.selectPlay({
        list: this.songs,
        index
      })
      // console.log('select', this.songs, song, index)
    },
    random () {
      this.randomPlay(this.songs)
    }
  },
  async mounted () {
    this.imageHeight = this.$refs.bgImage.clientHeight
    this.maxTranslateY = this.imageHeight - RESERVED_HEIGHT
  }
}
</script>
<style lang="scss" scoped>
  .music-list{
    position: relative;
    height: 100%;
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
      }
    }
    .title{
      position: absolute;
      left: 10%;
      width: 80%;
      line-height: 40px;
      font-size: $font-size-large;
      @include no-wrap();
      color: $color-text;
      text-align: center;
      z-index: 20;
    }
    .bg-image{
      position: relative;
      width: 100%;
      transform-origin: top;
      background-size: cover;
      .play-btn-wrapper {
        position: absolute;
        bottom: 20px;
        z-index: 10;
        width: 100%;
        .play-btn {
          box-sizing: border-box;
          width: 135px;
          padding: 7px 0;
          margin: 0 auto;
          text-align: center;
          border: 1px solid $color-theme;
          color: $color-theme;
          border-radius: 100px;
          font-size: 0;
        }
        .icon-play {
          display: inline-block;
          vertical-align: middle;
          margin-right: 6px;
          font-size: $font-size-medium-x;
        }
        .text {
          display: inline-block;
          vertical-align: middle;
          font-size: $font-size-small;
        }
      }
      .filter{
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(7, 17, 27, .4);
      }
    }
    .list{
      position: absolute;
      top: 40px;
      bottom: 0;
      width: 100%;
    }
  }
</style>
