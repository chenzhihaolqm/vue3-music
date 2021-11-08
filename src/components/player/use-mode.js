import { useStore } from 'vuex'
import { computed } from 'vue'
import { PLAY_MODE } from '@/assets/js/constant'
export default function useMode () {
  const store = useStore()
  const playMode = computed(() => store.state.playMode)
  const modeIcon = computed(() => {
    console.log('modeIcon', playMode.value)
    return playMode.value === PLAY_MODE.sequence ? 'icon-sequence'
      : (playMode.value === PLAY_MODE.random ? 'icon-random' : 'icon-loop')
  })
  const modeText = computed(() => {
    const playModeVal = playMode.value
    return playModeVal === PLAY_MODE.sequence
      ? '顺序播放'
      : playModeVal === PLAY_MODE.random
        ? '随机播放'
        : '单曲循环'
  })
  function changeMode () {
    const nextMode = (playMode.value + 1) % 3
    store.dispatch('changeMode', nextMode)
  }
  return {
    modeIcon,
    modeText,
    changeMode
  }
}
