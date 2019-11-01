import axios from '@/api'
import { underline, camel } from '../tool';

export function getMessages (params) {
  return axios.post('/get-messages/', params).then(res => {
    res.data = camel(res.data)
    res.data.list = res.data.list.map(post => camel(post))
    return res
  })
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