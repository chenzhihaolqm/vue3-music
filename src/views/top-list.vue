<template>
  <div class="top-list">
    <scroll class="top-list-content">
      <ul>
          <li v-for="item of topList" class="item" :key="item.id" @click="handleClickIem(item)">
            <div class="icon">
              <img width="100" hegiht="100" :src="item.pic" />
            </div>
            <div class="song-list">
              <div v-for="(song, index) of item.songList" class="song" :key="song.id">
                <span>{{index}}. </span>
                <span>{{song.songName}} {{song.singerName}}</span>
              </div>
            </div>
          </li>
        </ul>
    </scroll>
    <router-view v-slot={Component}>
       <transition appear name="slide">
          <component :is="Component"></component>
       </transition>
     </router-view>
  </div>
</template>
<script>
import Scroll from '@/components/base/scroll/scroll'
import { getTopList } from '@/service/top-list'
import { TOP_KEY } from '@/assets/js/constant'
import storage from 'good-storage'

export default {
  components: {
    Scroll
  },
  data () {
    return {
      topList: []
    }
  },
  methods: {
    handleClickIem (item) {
      this.cacheTop(item)
      this.$router.push({
        path: `/top-list/${item.id}`
      })
    },
    cacheTop (top) {
      storage.session.set(TOP_KEY, top)
    }
  },
  async created () {
    const res = await getTopList()
    this.topList = res.topList
    console.log(res)
  }
}
</script>
<style lang="scss" scoped>
.top-list{
  position: fixed;
  width: 100%;
  top: 88px;
  bottom: 0;
  .top-list-content{
    height: 100%;
    overflow: hidden;
    .item{
      display: flex;
      height: 100px;
      margin: 0 20px;
      padding-top: 20px;
      .icon{
        width: 100px;
      }
      .song-list{
        flex: 1;
        display: flex;
        padding: 0 20px;
        flex-direction: column;
        justify-content: center;
        overflow: hidden;
        font-size: $font-size-small;
        color: $color-text-d;
        background-color: $color-highlight-background;
        .song{
          @include no-wrap();
          line-height: 26px;
        }
      }
    }
  }
}
</style>
