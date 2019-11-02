import axios from '@/api'

export function addTag(params) {
  return axios.post('/add-tag/', params)
}

export function deleteTag(id) {
  return axios.get(`/delete-tag/${id}`)
}

export function getTagList () {
  return axios.get('/get-tags/')
}

export function updateTag (params) {
  return axios.post('/update-tag/', params)
}