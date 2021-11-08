<template>
  <div class="search">
    <div class="search-input-wrap">
      <search-input v-model="query"></search-input>
    </div>
    <scroll class="search-content" v-show="!query">
      <div class="hot-keys">
        <h1 class="title">热门搜索</h1>
        <ul>
          <li class="item" v-for="hot of hotKeys" :key="hot.id">
            <span>{{hot.key}}</span>
          </li>
        </ul>
      </div>
      <div class="search-history" v-show="searchHistory.length">
        <h1 class="title">
          <span class="text">搜索历史</span>
          <span class="clear" @click="showConfirm">
            <i class="icon-clear"></i>
          </span>
        </h1>
        <confirm ref="confirmRef"
          text="是否清空所有搜索历史"
          confirm-btn-text="清空"
          @confirm="clearSearch"
        ></confirm>
        <search-list
          :searches="searchHistory"
          @select="addQuery"
          @delete="deleteSearch"
        ></search-list>
      </div>
    </scroll>
    <div class="search-result" v-show="query">
      <suggest :query="query" @select-singer="selectSinger" @select-song="selectSong"></suggest>
    </div>
    <div>
      <router-view v-slot={Component}>
       <transition appear name="slide">
          <component :is="Component"></component>
       </transition>
     </router-view>
    </div>
  </div>
</template>
<script>
import { ref, computed } from 'vue'
import { useStore } from 'vuex'
import { useRouter } from 'vue-router'
import storage from 'good-storage'
import SearchInput from '@/components/search/search-input'
import Suggest from '@/components/search/suggest'
import Scroll from '@/components/base/scroll/scroll'
import SearchList from '@/components/base/search-list/search-list'
import Confirm from '@/components/base/confirm/confirm'
import { getHotKeys } from '@/service/search'
import useSearchHistory from '@/components/search/use-search-history'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  components: {
    Scroll,
    SearchInput,
    SearchList,
    Confirm,
    Suggest
  },
  setup () {
    const router = useRouter()
    const store = useStore()
    const query = ref('')
    const hotKeys = ref([])
    const confirmRef = ref(null)
    const searchHistory = computed(() => store.state.searchHistory)
    console.log('searchHistory', searchHistory)
    const { saveSearch, deleteSearch, clearSearch } = useSearchHistory()
    getHotKeys().then((res) => {
      hotKeys.value = res.hotKeys
      console.log('hotKey:', res.hotKeys)
    })
    function selectSinger (singer) {
      saveSearch(query.value)
      cacheSinger(singer)
      router.push({
        path: `/search/${singer.mid}`
      })
    }
    function selectSong (song) {
      saveSearch(query.value)
      store.dispatch('addSong', song)
    }
    function cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
    function addQuery (s) {
      query.value = s
    }
    function showConfirm () {
      console.log('showConfirm', confirmRef.value)
      confirmRef.value.show()
    }
    return {
      query,
      hotKeys,
      confirmRef,
      searchHistory,
      selectSinger,
      selectSong,
      deleteSearch,
      addQuery,
      showConfirm,
      clearSearch
    }
  }
}
</script>
<style lang="scss" scoped>
.search{
  display: flex;
  position: fixed;
  top: 88px;
  bottom: 0;
  width: 100%;
  flex-direction: column;
  .search-input-wrap{
    margin: 20px;
  }
  .search-content{
    flex: 1;
    overflow: hidden;
    .hot-keys{
      margin: 0 20px 20px 20px;
      .title{
        margin-bottom: 20px;
        font-size: $font-size-medium;
        color: $color-text-l;
      }
      .item{
        display: inline-block;
        padding: 5px 10px;
        border-radius: 6px;
        margin: 0 20px 10px 0;
        font-size: $font-size-medium;
        color: $color-text-d;
        background-color: $color-highlight-background;
      }
    }
    .search-history {
        position: relative;
        margin: 0 20px;
        .title {
          display: flex;
          align-items: center;
          height: 40px;
          font-size: $font-size-medium;
          color: $color-text-l;
          .text {
            flex: 1;
          }
          .clear {
            @include extend-click();
            .icon-clear {
              font-size: $font-size-medium;
              color: $color-text-d;
            }
          }
        }
      }
  }
  .search-result {
    flex: 1;
    overflow: hidden;
  }
}
</style>
