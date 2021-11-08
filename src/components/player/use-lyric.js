import { watch, computed, ref } from 'vue'
import { useStore } from 'vuex'
import { getLyric } from '@/service/song'
import Lyric from 'lyric-parser'

export default function useLyric ({ songReady, currentTime }) {
  const currentLyric = ref(null)
  const lyricWrapperRef = ref(null)
  const lyricListRef = ref(null)
  const playingLyric = ref('')
  const currentLineNum = ref(0)
  const store = useStore()
  const currentSong = computed(() => store.getters.currentSong)
  watch(currentSong, async (newSong) => {
    if (!(newSong.id && newSong.url)) {
      return
    }
    stopLyric()
    currentLyric.value = null
    currentLineNum.value = 0
    playingLyric.value = ''

    const lyric = await getLyric(newSong)
    console.log('lyric')
    currentLyric.value = new Lyric(lyric, ({ txt, lineNum }) => {
      playingLyric.value = txt
      currentLineNum.value = lineNum
      console.log('lineNum', lineNum, txt)
      const scrollComp = lyricWrapperRef.value
      const listEl = lyricListRef.value
      if (lineNum > 5) {
        const target = listEl.children[lineNum - 5]
        scrollComp.scroll.scrollToElement(target)
      } else {
        scrollComp.scroll.scrollTo(0, 0, 1000)
      }
    })
    console.log('watch Song Lyric', lyric)
    if (songReady.value) {
      playLyric()
    }
  })
  function playLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      console.log('play Song Lyric', currentTime.value * 1000)
      currentLyricVal.seek(currentTime.value * 1000)
    }
  }
  function stopLyric () {
    const currentLyricVal = currentLyric.value
    if (currentLyricVal) {
      currentLyricVal.stop()
    }
  }
  return {
    lyricWrapperRef,
    lyricListRef,
    currentLyric,
    playingLyric,
    currentLineNum,
    playLyric,
    stopLyric
  }
}
