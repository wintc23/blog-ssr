// const NOTIFY_LOGIN_GITHUB = 1
// const NOTIFY_LOGIN_QQ = 2
const NOTIFY_COMMENT = 3
// const NOTIFY_LIKE = 4
const NOTIFY_COMMENT_REPLY = 5
const NOTIFY_MESSAGE = 6
const NOTIFY_MESSAGE_REPLY = 7

import io from 'socket.io-client'
import Vue from 'vue'
import { getToken, camel } from '@/tool'
import { BASE_URL } from '@/config'

function notify ({ type, username, postTitle, url, content }) {
  let title = '', desc = ''
  const user = `<span style="color: #FFA710">${username}</span>`
  const post = `<span style="color: #2d8cf0">《${postTitle}》</span>`
  if (type == NOTIFY_COMMENT) {
    title = '新增评论'
    desc = `<a href="${url}" class="notify-link">${user}评论了文章${post}: ${content}</a>`
  } else if (type == NOTIFY_COMMENT_REPLY) {
    title = '评论回复'
    desc = `<a href="${url}" class="notify-link">${user}在${post}回复了你: ${content}</a>`
  } else if (type == NOTIFY_MESSAGE) {
    title = '新增留言',
    desc = `<a href="${url}" class="notify-link">${user}在留言板留言: ${content}</a>`
  } else if (type == NOTIFY_MESSAGE_REPLY) {
    title = '留言回复'
    desc = `<a href="${url}" class="notify-link">${user}回复了你的留言: ${content}</a>`
  }
  new Notification(title)
  Vue.prototype.$Notice.info({ title, desc, duration: 0 })
}

class Socket {
  constructor () {
    this.socket = null
  }
  init () {
    this.socket = io(BASE_URL)
    this.socket.on('connect', () => {
      console.log('connetc')
      this.socket.emit('bind-user', { token: getToken() })
    })
    this.socket.on('message', ({ type, data }) => {
      console.log('onmessage', type, data)
      data = camel(data)
      if (type == 'notify') {
        notify(data)
      }
    })
    this.socket.on('error', (err) => {
      console.log('error', err)
      this.socket.close()
      this.init()
    })
    this.socket.on('close', () => {
      this.destroy()
    })
  }

  destroy () {
    this.socket = null
  }
}

if (process.client) {
  Vue.prototype.$socket = new Socket()
}

