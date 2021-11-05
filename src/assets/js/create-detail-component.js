import MusicList from '@/components/music-list/music-list'
import storage from 'good-storage'
import { processSongs } from '@/service/song'
export default function createDetailComponent (name, key, fetch) {
  return {
    name,
    components: {
      MusicList
    },
    data () {
      return {
        cacheData: {},
        songs: [],
        loading: true
      }
    },
    computed: {
      pic () {
        const data = this.cacheData
        return data.pic
      },
      title () {
        const data = this.cacheData
        return data.name || data.title
      }
    },
    async created () {
      const cache = storage.session.get(key)
      if (!cache) {
        const path = this.$route.matched[0].path
        this.$router.push({
          path
        })
        return
      }
      this.cacheData = cache
      const result = await fetch(cache)
      this.songs = await processSongs(result.songs)
      this.loading = false
    }
  }
}
