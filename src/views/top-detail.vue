<template>
  <div class="top-detail">
    <music-list
      :songs="songs"
      :title="title"
      :pic="pic"
      :loading="loading"
      rank
    ></music-list>
  </div>
</template>
<script>
import { TOP_KEY } from '@/assets/js/constant'
import createDetailComponent from '@/assets/js/create-detail-component'
import { getTopDetail } from '@/service/top-list'
export default createDetailComponent('top-detail', TOP_KEY, getTopDetail)
</script>
<style lang="scss" scoped>
  .top-detail{
    position: fixed;
    left: 0;
    top: 0;
    bottom: 0;
    right: 0;
    z-index: 10;
    background-color: $color-background;
  }
</style>
