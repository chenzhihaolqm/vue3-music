const mutations = {
  setPlayingState (state, playing) {
    state.playing = playing
  },
  setSequenceList (state, list) {
    state.sequenceList = list
  },
  setPlaylist (state, list) {
    state.playlist = list
  },
  setCurrentIndex (state, index) {
    state.currentIndex = index
  },
  setPlayMode (state, mode) {
    state.playMode = mode
  },
  setFullScreen (state, fullScreen) {
    state.fullScreen = fullScreen
  },
  setFavoriteList (state, list) {
    state.favoriteList = list
  },
  setSearchHistory (state, list) {
    state.searchHistory = list
  },
  setPlayHistory (state, list) {
    state.playHistory = list
  }
}
export default mutations
