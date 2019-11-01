import axios from '@/api'
import uuidv4 from 'uuid/v4'
import { camel, underline } from '@/tool'

export function getPostsByType(params) {
  return axios.post('/get-type-posts/', params)
}

export function getPosts (params) {
  return axios.post('/get-posts/', params).then(res => {
    res.data = camel(res.data)
    res.data.list = res.data.list.map(post => camel(post))
    return res
  })
}

export function getPost(id, type) {
  let typeSuffix = type ? `/${type}` : ''
  return axios.get(`/get-post/${id}${typeSuffix}`).then(res => {
    res.data = camel(res.data)
    res.data.comments = res.data.comments.map(comment => camel(comment))
    return res
  })
}

export function getPostType() {
  return axios.get('/get-post-type/')
}

export function deletePost (postId) {
  return axios.get(`/delete-post/${postId}`)
}

export function savePost (params) {
  params = underline(params)
  return axios.post(`/save-post/`, params)
}

export function addPost (type) {
  return axios.get(`/add-post/${type}`)
}

export function uploadFile (file, callback, failCallback) {
  let filename = uuidv4().replace(/-/g, '')
  getFileUploadToken(filename).then(res => {
    if (res.status == 200) {
      let { token, domain } = res.data
      let formData = new FormData()
      formData.append('file', file)
      formData.append('token', token)
      formData.append('key', filename)
      axios.post('http://up-z2.qiniup.com/', formData, {
        headers: {
          'Authorization': token,
          'content-Type': 'multipart/form-data'
        }
      }).then(response => {
        console.log(response)
        if (response.status == 200) {
          let url = `${domain}/${response.data.key}`
          callback && callback(url)
        } else {
          failCallback && failCallback()
        }
      }).catch(() => {
        failCallback && failCallback()
      })
    } else {
      failCallback && failCallback()
    }
  }).catch(() => {
    failCallback && failCallback()
  })
}

export function getFileUploadToken (filename) {
  return axios.get(`/get-qiniu-token/${filename}`)
}

export function getAboutMe () {
  return axios.get('/get-about-me/')
}

export function likePost (postId) {
  return axios.get(`/like-post/${postId}`)
}

export function cancelLikePost (postId) {
  return axios.get(`/cancel-like-post/${postId}`)
}