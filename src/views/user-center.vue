<template>
  <div class="user-center" v-no-result:[noResultText]="noResult">
    <div class="back" @click="back">
      <i class="icon-back"></i>
    </div>
    <div class="switches-wrapper">
      <switches :items="['我喜欢的', '最近播放']" v-model="currentIndex"></switches>
    </div>
    <div v-if="currentList.length" class="play-btn" @click="random">
      <i class="icon icon-play"></i>
      <span class="text">随机播放全部</span>
    </div>
    <div class="list-wrapper">
      <scroll v-if="currentIndex===0" class="list-scroll">
        <div class="list-inner">
          <song-list :songs="favoriteList" @select="selectSong"></song-list>
        </div>
      </scroll>
      <scroll v-if="currentIndex===1" class="list-scroll">
        <div class="list-inner">
          <song-list :songs="playHistory" @select="selectSong"></song-list>
        </div>
      </scroll>
    </div>
  </div>
</template>
<script>
import { mapState, mapActions } from 'vuex'
import Scroll from '@/components/base/scroll/scroll'
import SongList from '@/components/base/song-list/song-list'
import Switches from '@/components/base/switches/switches'
export default {
  name: 'user-center',
  components: {
    Scroll,
    Switches,
    SongList
  },
  data () {
    return {
      currentIndex: 0
    }
  },
  computed: {
    ...mapState(['favoriteList', 'playHistory']),
    currentList () {
      return this.currentIndex === 0 ? this.favoriteList : this.playHistory
    },
    noResult () {
      return !this.currentList.length
    },
    noResultText () {
      return this.currentIndex === 0 ? '暂无收藏歌曲' : '当前没有历史歌曲'
    }
  },
  methods: {
    ...mapActions(['addSong', 'randomPlay']),
    back () {
      this.$router.back()
    },
    selectSong (song) {
      this.addSong(song)
    },
    random () {
      this.randomPlay(this.currentList)
    }
  }
}
</script>
<style lang="scss" scoped>
 .user-center{
   position: fixed;
   top: 0;
   bottom: 0;
   width: 100%;
   background-color: $color-background;
   .back{
     position: absolute;
     left: 6px;
     top: 0;
     z-index: 50;
     .icon-back{
       display: block;
       padding: 10px;
       font-size: $font-size-large-x;
       color: $color-theme;
     }
   }
   .switches-wrapper{
     margin: 10px 0 30px;
   }
   .play-btn{
     width: 135px;
     margin: 0 auto;
     padding: 6px 0;
     text-align: center;
     border: 1px solid $color-text-l;
     color: $color-text-l;
     border-radius: 100px;
     .icon-play{
       display: inline-block;
       margin-right: 6px;
       vertical-align: middle;
       font-size: $font-size-medium-x;
     }
     .text{
       display: inline-block;
       vertical-align: middle;
       font-size: $font-size-small;
     }
   }
   .list-wrapper{
     position: absolute;
     top: 110px;
     bottom: 0;
     width: 100%;
     overflow: hidden;
   }
 }
</style>
