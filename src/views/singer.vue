<template>
  <div class="singer">
    <index-list v-if="singers.length" :singers="singers" @select="handleSelect"></index-list>
     <router-view v-slot={Component}>
       <transition appear name="slide">
          <component :is="Component"></component>
       </transition>
     </router-view>
  </div>
</template>
<script>
import storage from 'good-storage'
import { getSingerList } from '@/service/singer'
import indexList from '@/components/index-list/index-list'
import { SINGER_KEY } from '@/assets/js/constant'
export default {
  name: 'singer',
  components: {
    indexList
  },
  data () {
    return {
      singers: []
    }
  },
  methods: {
    handleSelect (singer) {
      this.$router.push({
        path: `/singer/${singer.mid}`
      })
      this.cacheSinger(singer)
      console.log('singer', singer)
    },
    cacheSinger (singer) {
      storage.session.set(SINGER_KEY, singer)
    }
  },
  async mounted () {
    const result = await getSingerList()
    this.singers = result.singers
  }
}
</script>
<style lang="scss" scoped >
  .singer{
    position: fixed;
    top: 88px;
    bottom: 0;
    width: 100%;
  }
</style>
