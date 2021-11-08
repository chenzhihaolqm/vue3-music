<template>
  <m-header></m-header>
  <tab></tab>
  <router-view :style="viewStyle" v-slot="{ Component }">
    <keep-alive>
      <component :is="Component" />
    </keep-alive>
  </router-view>
  <router-view name="user" :style="viewStyle" v-slot="{ Component }">
    <transition name="slide">
      <keep-alive>
        <component :is="Component" />
      </keep-alive>
    </transition>
  </router-view>
  <player />
</template>

<script>
import Header from '@/components/header/header'
import Tab from '@/components/tab/tab'
import Player from '@/components/player/player'
export default {
  components: {
    MHeader: Header,
    Tab,
    Player
  },
  computed: {
    viewStyle () {
      return { bottom: this.$store.state.playlist.length ? '60px' : 0 }
    }
  }
}
</script>
