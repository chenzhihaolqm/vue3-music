import { PLAY_MODE } from '@/assets/js/constant'
import { shuffle } from '@/assets/js/util'

export function selectPlay ({ commit }, { list, index }) {
  commit('setPlayMode', PLAY_MODE.sequence)
  commit('setPlaylist', list)
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', index)
}

export function randomPlay ({ commit }, list) {
  commit('setPlayMode', PLAY_MODE.random)
  commit('setPlaylist', shuffle(list))
  commit('setSequenceList', list)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
  commit('setCurrentIndex', 0)
}

export function changeMode ({ commit, getters, state }, mode) {
  const currentId = getters.currentSong.id
  if (PLAY_MODE.random === mode) {
    commit('setPlaylist', shuffle(state.sequenceList))
  } else {
    commit('setPlaylist', state.sequenceList)
  }
  const index = state.playlist.findIndex(item => item.id === currentId)
  commit('setCurrentIndex', index)
  commit('setPlayMode', mode)
}

export function addSong ({ state, commit }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  const playIndex = findIndex(playlist, song)
  let currentIndex = 0
  if (playIndex > -1) {
    currentIndex = playIndex
  } else {
    playlist.push(song)
    currentIndex = playlist.length - 1
  }

  const sequenceIndex = findIndex(sequenceList, song)
  if (sequenceIndex === -1) {
    sequenceList.push(song)
  }
  commit('setPlaylist', playlist)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
  commit('setPlayingState', true)
  commit('setFullScreen', true)
}

export function removeSong ({ state, commit }, song) {
  const playlist = state.playlist.slice()
  const sequenceList = state.sequenceList.slice()
  let currentIndex = state.currentIndex
  const playIndex = findIndex(playlist, song)
  const sequenceIndex = findIndex(sequenceList, song)
  if (playIndex === -1 || sequenceList === -1) {
    return
  }
  playlist.splice(playIndex, 1)
  sequenceList.splice(sequenceIndex, 1)
  if (playIndex < currentIndex || currentIndex === playlist.length) {
    currentIndex--
  }
  if (!playlist.length) {
    commit('setPlayingState', false)
  }
  commit('setPlaylist', playlist)
  commit('setSequenceList', sequenceList)
  commit('setCurrentIndex', currentIndex)
}

export function clearSongList ({ commit }) {
  commit('setSequenceList', [])
  commit('setPlaylist', [])
  commit('setCurrentIndex', 0)
  commit('setPlayingState', false)
}

function findIndex (list, song) {
  return list.findIndex(item => item.id === song.id)
}
