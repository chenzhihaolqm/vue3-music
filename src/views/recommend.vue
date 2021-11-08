<template>
  <div class="recommend">
    <scroll class="recommend-content">
      <div>
        <div class="slider-wrapper">
          <div class="slider-content">
            <slider v-if="sliders.length" :sliders="sliders"></slider>
          </div>
        </div>
        <div class="recommend-list">
          <div class="recommend-title">热门歌单推荐</div>
          <ul>
            <li v-for="item of albums" :key="item.id" class="item" @click="clickAlbumItem(item)">
              <div class="icon">
                <img width="60" height="60" v-lazy="item.pic" />
              </div>
              <div class="text">
                <h2 class="name">{{item.username}}</h2>
                <p class="title">{{item.title}}</p>
              </div>
            </li>
          </ul>
        </div>
      </div>
    </scroll>
    <router-view v-slot="{ Component }">
      <transition appear name="slide">
        <component :is="Component" />
      </transition>
    </router-view>
  </div>
</template>
<script>
import storage from 'good-storage'
import { getRecommend } from '@/service/recommend'
import Scroll from '@/components/base/scroll/scroll'
import Slider from '@/components/base/slider/slider'
import { ALBUM_KEY } from '@/assets/js/constant'
export default {
  name: 'recommend',
  components: {
    Scroll,
    Slider
  },
  data () {
    return {
      sliders: [],
      albums: [],
      selectedAlbum: null
    }
  },
  methods: {
    clickAlbumItem (album) {
      this.cacheAlbum(album)
      this.$router.push({
        path: `/recommend/${album.id}`
      })
    },
    cacheAlbum (album) {
      storage.session.set(ALBUM_KEY, album)
    }
  },
  async mounted () {
    const result = await getRecommend()
    this.sliders = result.sliders
    this.albums = result.albums
    console.log('result', result)
  }
}
</script>
<style lang="scss" scoped>
  .recommend{
     position: fixed;
     top: 88px;
     bottom: 0;
     width: 100%;
    .recommend-content{
      height: 100%;
      overflow: hidden;
      .slider-wrapper{
        position: relative;
        height: 0;
        padding-top: 40%;
        overflow: hidden;
        .slider-content{
          position: absolute;
          top: 0;
          left: 0;
          height: 100%;
          width: 100%;
        }
      }
      .recommend-list{
        .recommend-title{
          height: 65px;
          line-height: 65px;
          text-align: center;
          font-size: $font-size-medium;
          color: $color-theme;
        }
        .item{
          display: flex;
          padding: 0 20px 20px 20px;
          align-items: center;
          .text{
            font-size: $font-size-medium;
          }
          .icon{
            width: 60px;
            padding-right: 20px;
          }
          .name{
            margin-bottom: 10px;
            color: $color-text;
          }
          .title{
            color: $color-text-d;
          }
        }
      }
    }
  }

</style>
