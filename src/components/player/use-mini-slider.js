
import BScroll from '@better-scroll/core'
import Slide from '@better-scroll/slide'
import { onMounted, onUnmounted, onActivated, onDeactivated, ref, computed, watch, nextTick } from 'vue' //
import { useStore } from 'vuex'
BScroll.use(Slide)
export default function useMiniSlider () {
  const store = useStore()
  const sliderWrapperRef = ref(null)
  const slider = ref(null)
  const currentIndex = computed(() => store.state.currentIndex)
  const fullScreen = computed(() => store.state.fullScreen)
  const playlist = computed(() => store.state.playlist)
  const sliderShow = computed(() => {
    return !fullScreen.value && !!playlist.value
  })
  onMounted(() => {
    let sliderVal = null
    watch(sliderShow, async (newShow) => {
      if (!newShow) {
        return
      }
      await nextTick()
      if (!sliderVal) {
        console.log('init Slider')
        sliderVal = slider.value = new BScroll(sliderWrapperRef.value, {
          click: true,
          scrollX: true,
          scrollY: false,
          momentum: false,
          bounce: false,
          probeType: 2,
          slide: {
            autoplay: false,
            loop: true
          }
        })
        sliderVal.on('slideWillChange', ({ pageX }) => {
          store.commit('setCurrentIndex', pageX)
        })
      } else {
        sliderVal.refresh()
      }
      sliderVal.goToPage(currentIndex.value, 0, 0)
    })
    watch(currentIndex, (index) => {
      if (sliderShow.value && sliderVal) {
        sliderVal.goToPage(index, 0, 0)
      }
    })
    watch(playlist, async () => {
      if (sliderShow.value && sliderVal) {
        await nextTick()
        sliderVal.refresh()
      }
    })
  })

  onActivated(() => {
    slider.value.enable()
    slider.value.refresh()
  })
  onDeactivated(() => {
    slider.value.disable()
  })
  onUnmounted(() => {
    slider.value && slider.value.destroy()
  })
  return {
    sliderWrapperRef
  }
}
