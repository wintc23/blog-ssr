import axios from '@/api'

export function addTopic(params) {
  return axios.post('/add-topic/', params)
}

export function deleteTopic(id) {
  return axios.get(`/delete-topic/${id}`)
}

export function getTopicList () {
  return axios.get('/get-topics/')
}

export function updateTopic (params) {
  return axios.post('/update-topic/', params)
}  