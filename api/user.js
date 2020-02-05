import axios from '@/api'

export function githubLogin (code) {
  return axios.get(`/github-login/${code}`)
}

export function qqLogin (params) {
  return axios.post(`/qq-login/`, params)
}

export function getUserInfoByToken () {
  return axios.get('/get-self/')
}

export function getUserInfoById (id) {
  return axios.get(`/get-user/${id}`)
}

export function getUserDetail (id) {
  return axios.get(`/get-user-detail/${id}`)
}

export function checkAdmin () {
  return axios.get('/check-admin/')
}

export function getAdminInfo () {
  return axios.get('/get-user-info/')
}

export function setEmail (data) {
  return axios.post('/set-email/', data)
}

// export default {
  // register (params) {
    // return axios.post('/api/register/', params)
  // },
  // login (params) {
    // return axios.post('/api/tokens/', {}, {
      // headers: {
        // 'Authorization': `${params.email}:${params.password}`
      // }
    // })
  // },
  // getUserInfoByToken () {
    // return axios.get('/api/user/')
  // },
  // getUserInfoById (id) {
    // return axios.get('/api/userinfo/?id=' + id)
  // },
  // getManagerId () {
    // return axios.get('/api/userid/')
  // },
  // confirmAccount (params) {
    // return axios.post('/api/confirm/', params)
  // },
  // changePasswd (params) {
    // return axios.post('/api/change-password/', params)
  // },
  // changeAvatar (data) {
    // return axios.put('/api/save-user-avatar/', data, {
      // headers: { 'content-Type': 'multipart/form-data' }
    // })
  // },
  // changeUsername (params) {
    // return axios.post('/api/change-username/', params)
  // },
  // githubLogin (code) {
    // return axios.get('/api/github_login/?code=' + code)
  // },
  // getUserDetail (id) {
    // return axios.get(`/api/user_detail/?id=${id}`)
  // }
// }