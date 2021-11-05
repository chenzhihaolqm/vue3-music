<template>
  <div class="singer-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
    ></music-list>
  </div>
</template>
<script>
import { SINGER_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
import { getSingerDetail } from '@/service/singer'
export default createDetailComponent('singer-detail', SINGER_KEY, getSingerDetail)
</script>
<style lang="scss" scoped>
  .singer-detail{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background-color: $color-background;
  }
</style>
