import axios from 'axios'
import { getToken, clearToken, camel, underline } from '@/tool'
import { Message } from 'iview'
import { BASE_URL } from '@/config'

const beforeRequest = (config) => {
  let token = getToken()
  config.headers = config.headers || {}
  if (token && !config.headers['Authorization']) {
    config.headers['Authorization'] = token
  }
  config.data = underline(config.data)
  return config
}

function requestError (error) {
  return Promise.reject(error)
}

function resPreHandle (response) {
  response.data = camel(response.data)
  if (response.data && response.data.notify) {
    process.client && Message.success(response.data.message)
  }
  return response
}

function responseError (error) {
  const { response: res } = error
  if (res && res.data) res.data = camel(res.data)
  if (process.client) {
    res && res.data && res.data.notify && Message.error(res.data.message)
    res.status === 401 && clearToken()
  }
  return Promise.reject(error)
}

const instance = axios.create({
  baseURL: `${BASE_URL}`,
  timeout: 60 * 1000,
})

instance.interceptors.request.use(beforeRequest, requestError)
instance.interceptors.response.use(resPreHandle, responseError)

export default instance