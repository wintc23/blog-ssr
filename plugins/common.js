import Vue from 'vue'

import Avatar from '@/components/Avatar'
import { Modal } from 'iview'

import { formatTime } from '@/tool'

Vue.prototype.$bus = new Vue()

Vue.prototype.$formatTime = formatTime

Vue.prototype.$timeShow = (timestamp) => {
  let date = timestamp * 1000
  let now = new Date()
  now = +now + now.getTimezoneOffset() * 60 * 1000
  let delta = Math.floor((now - date) / 1000)
  if (delta < 60) return '刚刚'
  if (delta < 60 * 60) return `${Math.floor(delta/60)}分钟前`
  if (delta < 24 * 60 * 60) return `${Math.floor(delta/60/60)}小时前`
  if (delta < 3 * 24 * 60 * 60) return `${Math.floor(delta/60/60/24)}天前`
  if (new Date(date).getFullYear() == new Date().getFullYear()) return formatTime(timestamp, 'MM-dd HH:mm')
  return formatTime(timestamp, 'yyyy-MM-dd')
}

Vue.prototype.$site = {
  title: '木马tc个人博客',
  slogon: '分享编程与生活',
  keywords: '木马tc个人博客,编程,JS,HTML,CSS,Python',
  description: '木马tc个人博客，分享编程和生活。'
}

if (process.client) {
  Vue.component('avatar', Avatar)

  Vue.prototype.$IsPC = (() => {
    let userAgentInfo = navigator.userAgent
    let Agents = ["Android", "iPhone", "SymbianOS", "Windows Phone", "iPad", "iPod"]
    let flag = true
    for (let v = 0; v < Agents.length; v++) {
      if (userAgentInfo.indexOf(Agents[v]) > 0) {
        flag = false
        break
      }
    }
    return flag
  })()

  Vue.prototype.$confirm = function confirm (text, func, ...args) {
    Modal.confirm({
      render: (h) => {
        return h('div', {
          domProps: {
            innerHTML: text
          },
          style: {
            'word-wrap': 'break-word'
          }
        })
      },
      onOk: () => {
        func(...args)
      }
    })
  }

}