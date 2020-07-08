// 文章目录左侧显示

export const state = () => ({
  list: null
})

export const getters = {
  list (state) {
    return state.list || []
  }
}

export const mutations = {
  setNavList (state, list) {
    state.list = list
  }
}