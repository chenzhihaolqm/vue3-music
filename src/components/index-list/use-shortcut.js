import { computed, ref } from 'vue'

export default function useShortcut (props, groupRef) {
  const ANCHOR_HEIGHT = 18
  const scrollRef = ref(null)
  const shortcutList = computed(() => {
    return props.singers.map(item => {
      return item.title
    })
  })
  const touch = {}
  function onShortcutTouchStart (event) {
    const anchorIndex = parseInt(event.target.dataset.index)
    touch.anchorIndex = anchorIndex
    touch.y1 = event.touches[0].pageY
    scrollTo(anchorIndex)
  }
  function onShortcutTouchMove (event) {
    touch.y2 = event.touches[0].pageY
    const delta = (touch.y2 - touch.y1) / ANCHOR_HEIGHT | 0
    const anchorIndex = touch.anchorIndex + delta
    scrollTo(anchorIndex)
  }

  function scrollTo (index) {
    index = Math.max(0, Math.min(shortcutList.value.length - 1, index))
    const targetEle = groupRef.value.children[index]
    const scroll = scrollRef.value.scroll
    scroll.scrollToElement(targetEle, 0)
  }
  return {
    scrollRef,
    shortcutList,
    onShortcutTouchStart,
    onShortcutTouchMove
  }
}
