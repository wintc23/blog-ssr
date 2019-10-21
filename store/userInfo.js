// 当前用户信息
import { getUserInfoByToken } from '@/api/user'

import { getToken, clearToken } from '@/tool'
import { BASE_URL } from '@/config'

export const state = () => ({
  username: '',
  avatar: '',
  admin: false,
  id: '',
  loadingStatus: 0
})

export const getters = {
  info (state) {
    return {
      id: state.id,
      username: state.username,
      admin: state.admin,
      avatar: state.avatar
    }
  }
}

export const actions = {
  getUserInfo (context, data = {}) {
    console.log('get1')
    if (!data.force && this.loadingStatus) return
    console.log('get2', getToken())

    if (getToken()) {
      console.log('get3')

      this.loadingStatus = 1
      return getUserInfoByToken().then(res => {
        if (res.status === 200) {
          context.commit('setInfo', res.data)
          this.loadingStatus = 2
          return true
        } else {
          this.loadingStatus = 0
          return false
        }
      }).catch(error => {
        this.loadingStatus = 0
        clearToken()
      })
    }
  }
}

export const mutations = {
  setInfo (state, data) {
    for (let key in data) {
      state[key] = data[key]
    }
    if (data.avatar) {
      state.avatar = `${BASE_URL}/get-file/?filename=${data.avatar}&path=avatar`
    }
  },
  clearInfo (state) {
    state.username = ''
    state.avatar = ''
    state.admin = false
    state.id = ''
  }
}
