import { useStore } from 'vuex'
import { computed } from 'vue'
import { save, remove } from '@/assets/js/array-store'
import { FAVORITE_KEY } from '@/assets/js/constant'
export default function useFavorite () {
  const store = useStore()
  const favoriteList = computed(() => store.state.favoriteList)

  function getFavoriteIcon (song) {
    // console.log('getFavoriteIcon')
    return isFavorite(song) ? 'icon-favorite' : 'icon-not-favorite'
  }
  function checkRender () {
    // console.log('render')
  }
  function toggleFavorite (song) {
    console.log('toggleFavorite')
    const compare = (item) => {
      return item.id === song.id
    }
    let list
    if (isFavorite(song)) {
      list = remove(FAVORITE_KEY, compare)
    } else {
      const maxLen = 100
      list = save(song, FAVORITE_KEY, compare, maxLen)
    }
    store.commit('setFavoriteList', list)
  }

  function isFavorite (song) {
    return favoriteList.value.findIndex(item => item.id === song.id) > -1
  }
  return {
    getFavoriteIcon,
    toggleFavorite,
    checkRender
  }
}
