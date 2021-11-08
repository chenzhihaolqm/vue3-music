import animations from 'create-keyframe-animation'
export default function useAnimation (cdRef) {
  let entering = false
  let leaving = false
  function enter (e, done) {
    if (leaving) {
      afterLeave()
    }
    entering = true
    const { diffX, diffY, scale } = getPosAndScale()
    const animation = {
      0: {
        transform: `translate3d(${diffX}px, ${diffY}px, 0) scale(${scale})`
      },
      100: {
        transform: 'translate3d(0, 0, 0) scale(1)'
      }
    }
    animations.registerAnimation({
      name: 'move',
      animation,
      presets: {
        duration: 600,
        easing: 'linear'
      }
    })
    animations.runAnimation(cdRef.value, 'move', done)
  }
  function afterEnter () {
    const el = cdRef.value
    animations.unregisterAnimation('move')
    el.style.transition = ''
    entering = false
  }
  function leave (e, done) {
    if (entering) {
      afterEnter()
    }
    leaving = true
    const el = cdRef.value
    const { diffX, diffY, scale } = getPosAndScale()
    el.style.transition = 'transform .6s linear'
    el.style.transform = `translate3d(${diffX}px, ${diffY}px, 0) scale(${scale})`
    el.addEventListener('transitionend', next)
    function next () {
      el.removeEventListener('transitionend', next)
      console.log('transition end done')
      done()
    }
  }
  function afterLeave () {
    const el = cdRef.value
    el.style.transition = ''
    el.style.transform = ''
    leaving = false
  }
  function getPosAndScale () {
    const cdWidth = window.innerWidth * 0.8
    const cdPaddingTop = 80
    const startLeft = window.innerWidth * 0.5
    const startBottom = window.innerHeight - cdPaddingTop - (cdWidth * 0.5)
    const endLeft = 40
    const endBottom = 30
    const targetWidth = 40
    const diffX = -(startLeft - endLeft)
    const diffY = startBottom - endBottom
    const scale = targetWidth / cdWidth
    return {
      diffX,
      diffY,
      scale
    }
  }
  return {
    enter,
    afterEnter,
    leave,
    afterLeave
  }
}
