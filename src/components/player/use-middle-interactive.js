import { ref } from 'vue'
export default function useMiddleInteractive () {
  const currentShow = ref('cd')
  const middleLStyle = ref('')
  const middleRStyle = ref('')
  const duration = 300
  const touch = {}
  let currentView = 'cd'
  function onMiddleTouchStart (e) {
    const { pageX, pageY } = e.touches[0]
    touch.startX = pageX
    touch.startY = pageY
    touch.directionLocked = ''
  }
  function onMiddleTouchMove (e) {
    const { pageX, pageY } = e.touches[0]
    const deltaX = pageX - touch.startX
    const deltaY = pageY - touch.startY
    if (!touch.directionLocked) {
      touch.directionLocked = Math.abs(deltaX) > Math.abs(deltaY) ? 'h' : 'v'
    }
    if (touch.directionLocked === 'v') {
      return
    }
    const left = currentView === 'cd' ? 0 : -window.innerWidth
    const offsetWidth = Math.max(-window.innerWidth, Math.min(0, left + deltaX))
    const percent = Math.abs(offsetWidth / window.innerWidth)
    if (currentView === 'cd') {
      currentShow.value = percent > 0.2 ? 'lyric' : 'cd'
    } else {
      currentShow.value = percent > 0.8 ? 'lyric' : 'cd'
    }
    middleLStyle.value = {
      opacity: 1 - percent
    }
    middleRStyle.value = {
      transform: `translate3d(${offsetWidth}px, 0, 0)`
    }
    console.log('delta', deltaX, deltaY, offsetWidth, percent)
  }
  function onMiddleTouchEnd () {
    currentView = currentShow.value
    middleLStyle.value = {
      opacity: currentView === 'cd' ? 1 : 0,
      transitionDuration: `${duration}ms`
    }
    middleRStyle.value = {
      transform: `translate3d(${currentView === 'cd' ? 0 : -window.innerWidth}px, 0, 0)`,
      transitionDuration: `${duration}ms`
    }
  }
  return {
    currentShow,
    middleLStyle,
    middleRStyle,
    onMiddleTouchStart,
    onMiddleTouchMove,
    onMiddleTouchEnd
  }
}
