<template>
  <div class="song-list-wrap">
    <ul class="song-list">
      <li v-for="(song, index) of songs" :key="song.id" class="item" @click="selectItem(song, index)">
        <div class="rank" v-if="rank" :class="getRankCls(index)">
          {{getRankText(index)}}
        </div>
        <div class="content">
          <div class="name">{{song.name}}</div>
          <div class="desc">{{getDesc(song)}}</div>
        </div>
      </li>
    </ul>
  </div>
</template>
<script>
export default {
  name: 'songlist',
  type: '',
  props: {
    rank: Boolean,
    songs: {
      type: Array,
      default () {
        return []
      }
    }
  },
  emits: ['select'],
  methods: {
    getRankCls (index) {
      if (index < 3) {
        return `icon icon-${index + 1}`
      }
      return 'text'
    },
    getRankText (index) {
      if (index < 3) {
        return ''
      }
      return `${index + 1}`
    },
    getDesc (song) {
      return `${song.singer}·${song.album}`
    },
    selectItem (song, index) {
      this.$emit('select', song, index)
    }
  }
}
</script>
<style lang="scss" scoped>
  .song-list-wrap{
    padding: 20px 30px;
    background-color: $color-background;
    .item{
      display: flex;
      height: 64px;
      font-size: $font-size-medium;
      align-items: center;
      color: $color-text;
      .rank{
        flex: 0 0 25px;
        width: 25px;
        height: 24px;
        background-size: 25px 24px;
        margin-right: 20px;
        text-align: center;
        &.icon-1{
          @include bg-image('first')
        }
        &.icon-2{
          @include bg-image('second')
        }
        &.icon-3{
          @include bg-image('third')
        }
        &.text{
          font-size: $font-size-large;
          color: $color-theme;
        }
      }
      .content{
        flex: 1;
        line-height: 20px;
        .name{
          @include no-wrap();
        }
        .desc{
          @include no-wrap();
          margin-top: 4px;
          color: $color-text-d;
        }
      }
    }
  }
</style>
