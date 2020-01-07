// 用户信息集，避免重复获取
import { getUserInfoById } from '@/api/user'
import { BASE_URL } from '@/config'

export const state = () => ({
  info: {},
  loading: {}
})

export const actions = {
  getInfo (context, data) {
    if (context.state.loading[data.id]) return
    if (context.state.info[data.id] && !data.force) return
    context.commit('setLoading', { id: data.id, status: true})
    getUserInfoById(data.id).then(res => {
      res.status === 200 && context.commit('setInfo', res.data)
      context.commit('setLoading', { id: data.id, status: false })
    }).catch(error => {
      console.log(error)
      context.commit('setLoading', { id: data.id, status: false })
    })
  }
}

export const mutations = {
  setInfo (state, data) {
    state.info = Object.assign({}, state.info, { [data.id]: data })
  },
  setLoading (state, data) {
    state.loading[data.id] = data.status
  }
}
