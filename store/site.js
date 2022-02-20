import { getTopTen } from '@/api/posts'
import { getAdminInfo } from '@/api/user'
import { getTagList } from '@/api/tag'
import { getTopicList } from '@/api/topic'
import { getBasicLinkList } from '@/api/link'

export const state = () => ({
  admin: null,
  topTen: null,
  tagList: null,
  topicList: null,
  linkList: null
})

export const actions = {
  getAdminInfo ({ commit }) {
    return new Promise((resolve) => {
      getAdminInfo().then(res => {
        if (res.status === 200) {
          commit('setAdmin', res.data)
        }
      })
      resolve(true);
    })
  },
  getTagList ({ commit }) {
    return getTagList().then(res => {
      if (res.status === 200) {
        commit('setTagList', res.data.list)
        return true
      }
    })
  },
  getTopicList ({ commit }) {
    return getTopicList().then(res => {
      if (res.status === 200) {
        commit('setTopicList', res.data.list)
        return true
      }
    })
  },
  getTopTen ({ commit }) {
    return getTopTen().then(res => {
      if (res.status === 200) {
        commit('setTopTen', res.data.list)
        return true
      }
    })
  },
  getFrindLinkList ({ commit }) {
    return getBasicLinkList().then(res => {
      commit('setLinkList', res.data.list)
      return true
    })
  }
}

export const mutations = {
  setAdmin (state, data) {
    state.admin = data
  },
  setTagList (state, list) {
    state.tagList = list
  },
  setTopTen (state, list) {
    state.topTen = list
  },
  setTopicList (state, list) {
    state.topicList = list
  },
  setLinkList (state, list) {
    state.linkList = list
  }
}

export const getters = {
  adminInfo (state) {
    return state.admin
  },
  tags (state) {
    return state.tagList
  },
  topTen (state) {
    return state.topTen
  },
  topics (state) {
    return state.topicList
  },
  links (state) {
    return state.linkList
  }
}
