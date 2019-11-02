import axios from '@/api'

export function getMessages (params) {
  return axios.post('/get-messages/', params)
}

export function addMessage (params) {
  params = underline(params)
  return axios.post('/add-message/', params)
}

export function getHideMessage (params) {
  return axios.post('/get-hide-messages/', params)
}

export function deleteMessage (msgId) {
  return axios.get(`/delete-message/${msgId}`)
}

export function setMessageShow (msgId) {
  return axios.get(`/set-message-show/${msgId}`)
}