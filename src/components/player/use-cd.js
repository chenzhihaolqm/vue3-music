import { computed, ref, watch } from 'vue'
import { useStore } from 'vuex'
export default function useCd () {
  const cdRef = ref(null)
  const cdImageRef = ref(null)
  const store = useStore()
  const playing = computed(() => {
    return store.state.playing
  })
  const cdCls = computed(() => {
    return playing.value ? 'playing' : ''
  })
  watch(playing, (newPlaying) => {
    if (!newPlaying) {
      syncTransform(cdRef.value, cdImageRef.value)
    }
  })
  function syncTransform (wrapper, inner) {
    if (!wrapper || !inner) {
      return
    }
    const wrapperTransform = getComputedStyle(wrapper).transform
    const innerTransform = getComputedStyle(inner).transform
    wrapper.style.transform = wrapperTransform === 'none' ? innerTransform : innerTransform.concat(' ', wrapperTransform)
    console.log(wrapperTransform, innerTransform)
  }
  return {
    cdRef,
    cdImageRef,
    cdCls
  }
}
