<template>
  <div class="suggest" ref="rootRef">
    <div>
      <ul class="suggest-list">
        <li
          class="suggest-item"
          v-if="singer"
          @click="selectSinger(singer)"
        >
          <div class="icon">
            <i class="icon-mine"></i>
          </div>
          <div class="name">
            <p class="text">{{ singer.name }}</p>
          </div>
        </li>
        <li class="suggest-item" v-for="song of songs" :key="song.id"  @click="selectSong(song)">
          <div class="icon">
            <i class="icon-music"></i>
          </div>
          <div class="name">
            <p class="text">{{song.singer}}-{{song.name}}</p>
          </div>
        </li>
        <div
          class="suggest-item"
          v-loading:[loadingText]="pullUpLoading"
        ></div>
      </ul>
    </div>
  </div>
</template>
<script>
import { ref, watch, computed } from 'vue'
import storage from 'good-storage'
import { SINGER_KEY } from '@/assets/js/constant'
import { getSingerDetail } from '@/service/singer'
import { processSongs } from '@/service/song'
import usePullUpLoad from './use-pull-up-load'
export default {
  props: {
    query: String
  },
  emits: ['select-song', 'select-singer'],
  setup (props, { emit }) {
    const singer = ref(null)
    const songs = ref([])
    const hasMore = ref(true)
    const page = ref(1)
    const loadingText = ref('加载中...')
    const { rootRef, isPullUpLoad } = usePullUpLoad(searchMore)
    const pullUpLoading = computed(() => {
      return isPullUpLoad.value && hasMore.value
    })
    watch(() => props.query, async (newVal) => {
      if (!newVal) {
        return
      }
      searchFirst()
    })

    async function searchFirst () {
      if (!props.query) {
        return
      }
      const cache = storage.session.get(SINGER_KEY)
      const res = await getSingerDetail(cache)
      singer.value = cache
      songs.value = await processSongs(res.songs)
      hasMore.value = true
      console.log('..watch. songs.', page.value++, songs)
    }
    async function searchMore () {
      console.log('searchMore...')
      if (!hasMore.value || !props.query) {
        return
      }
      const cache = storage.session.get(SINGER_KEY)
      const res = await getSingerDetail(cache)
      singer.value = cache
      songs.value = songs.value.concat(await processSongs(res.songs))
      hasMore.value = page.value < 4
      console.log('..watch. songs.', page.value++, songs)
    }
    function selectSinger (singer) {
      console.log('selectSinger', singer)
      emit('select-singer', singer)
    }

    function selectSong (song) {
      console.log('selectSong', song)
      emit('select-song', song)
    }

    return {
      rootRef,
      singer,
      songs,
      loadingText,
      pullUpLoading,
      selectSinger,
      selectSong
    }
  }
}
</script>
<style lang="scss" scoped>
  .suggest {
    height: 100%;
    overflow: hidden;
    .suggest-list {
      padding: 0 30px;
      .suggest-item {
        display: flex;
        align-items: center;
        padding-bottom: 20px;
        .icon {
          flex: 0 0 30px;
          width: 30px;
          [class^="icon-"] {
            font-size: 14px;
            color: $color-text-d;
          }
        }
        .name {
          flex: 1;
          font-size: $font-size-medium;
          color: $color-text-d;
          overflow: hidden;
          .text {
            @include no-wrap();
          }
        }
      }
    }
  }
</style>
