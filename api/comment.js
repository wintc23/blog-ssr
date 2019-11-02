import axios from '@/api'

export function addComment (params) {
  return axios.post('/add-comment/', params)
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