import axios from '@/api'

export function getLinkList () {
  return axios.get('/get-link-list/')
}

export function getBasicLinkList () {
  return axios.get('/get-basic-link-list/')
}

export function addLink (data) {
  return axios.post('/add-link/', data)
}

export function updateLink (data) {
  return axios.post('/update-link/', data)
}

export function saveLink (data) {
  return data.id ? updateLink(data) : addLink(data)
} 

export function deleteLink (id) {
  return axios.get(`/delete-link/${id}`)
}

export function checkLink (id) {
  return axios.get(`/check-link/${id}`)
}

