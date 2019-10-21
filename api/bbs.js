import axios from '@/api'

export default {
  getAllBBS (page) {
    return axios.post('/api/bbs/', { page })
  },
  addBBS (params) {
    return axios.post('/api/add_bbs/', params)
  },
  getRecentBBS () {
    return axios.get('/api/get-recent-bbs/')
  }
}
