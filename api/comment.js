import axios from '@/api'
import { camel } from '@/tool'


export function addComment (params) {
  return axios.post('/add-comment/', params).then(res => {
    res.data = camel(res.data)
  })
}

export function getComments (params) {
  return axios.post('/get-comments/', params)
}

export function deleteComment (commentId) {
  return axios.get(`/delete-comment/${commentId}`)
}

export function setCommentShow (commentId) {
  return axios.get(`/set-comment-show/${commentId}`)
}