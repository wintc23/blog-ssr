import { getTopicList } from '@/api/topic'
import { getTagList } from '@/api/tag'

export const state = () => ({
  tagList: null,
  topicList: null
})

export const getters = {
  tags (state) {
    return state.tagList || []
  },
  topics (state) {
    return state.topicList || []
  }
}

export const mutations = {
  setTagList (state, list) {
    state.tagList = list
  },
  setTopicList (state, list) {
    state.topicList = list || []
  }
}

export const actions = {
  getTagList ({ commit, state }, data = {}) {
    if (!data.force && state.list) return
    getTagList().then(res => {
      if (res.status == 200) {
        commit('setTagList', res.data.list)
      }
    })
  },
  getTopicList ({ commit, state }, data = {}) {
    if (!data.force && state.list) return
    getTopicList().then(res => {
      if (res.status == 200) {
        commit('setTopicList', res.data.list)
      }
    })
  },
}
