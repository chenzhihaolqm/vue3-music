
import { computed, onMounted, ref, watch } from 'vue'
export default function useFixed (props) {
  const FIXED_HEIGHT = 30
  const groupRef = ref(null)
  const scrollY = ref(0)
  const currentIndex = ref(0)
  const distance = ref(0)
  const listHeights = ref([])

  const fixedTitle = computed(() => {
    if (scrollY.value < 0) {
      return
    }
    const group = props.singers[currentIndex.value]
    return group ? group.title : ''
  })
  const fixedStyle = computed(() => {
    if (scrollY.value < 0) {
      return
    }
    return {
      transform: `translateY(${-distance.value}px)`
    }
  })
  const handleScroll = (page) => {
    scrollY.value = -page.y
  }
  const caculate = () => {
    let height = 0
    listHeights.value.push(height)
    groupRef.value.children.forEach(item => {
      height += item.clientHeight
      listHeights.value.push(height)
    })
  }
  watch(scrollY, (newVal) => {
    const listHeightsVal = listHeights.value
    for (let i = 0; i < listHeightsVal.length - 1; i++) {
      if (listHeightsVal[i] <= newVal && newVal <= listHeightsVal[i + 1]) {
        currentIndex.value = i
        const diff = listHeightsVal[i + 1] - newVal
        distance.value = diff < FIXED_HEIGHT ? (FIXED_HEIGHT - diff) : 0
      }
    }
    // console.log('currentIndex.value', currentIndex.value, newVal, listHeightsVal[currentIndex.value], listHeightsVal[currentIndex.value + 1])
  })
  onMounted(() => {
    caculate()
  })
  return {
    groupRef,
    currentIndex,
    fixedTitle,
    fixedStyle,
    handleScroll
  }
}
