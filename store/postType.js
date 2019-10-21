import { getPostType } from '@/api/posts'

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    if (!state.list) return []
    return state.list.filter(item => !item.special)
  },
  manageList (state) {
    return state.list || []
  },
  typeInfo (state) {
    let info = {}
    state.list && state.list.forEach(item => info[item.id] = item)
    return info
  }
}

export const mutations = {
  setPostType (state, list) {
    list.sort((a, b) => a.sort - b.sort)
    state.list = list
  }
}

export const actions = {
  getType ({ commit, state }, data = {}) {
    if (!data.force && state.list) return
    getPostType().then(res => {
      if (res.status == 200) {
        commit('setPostType', res.data.list)
      }
    })
  }
}
