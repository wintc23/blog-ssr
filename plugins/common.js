import Vue from 'vue'

import Avatar from '@/components/Avatar'
import { Modal } from 'iview'

import { formatTime, SITE } from '@/tool'

Vue.prototype.$bus = new Vue()

Vue.prototype.$formatTime = formatTime

Vue.prototype.$timeShow = (timestamp) => {
  let now = new Date()
  let localTimestamp = timestamp - now.getTimezoneOffset() * 60
  let date = localTimestamp * 1000
  let delta = Math.floor((now - date) / 1000)
  if (delta < 60) return '刚刚'
  if (delta < 60 * 60) return `${Math.floor(delta/60)}分钟前`
  if (delta < 24 * 60 * 60) return `${Math.floor(delta/60/60)}小时前`
  if (delta < 3 * 24 * 60 * 60) return `${Math.floor(delta/60/60/24)}天前`
  if (new Date(date).getFullYear() == new Date().getFullYear()) return formatTime(timestamp, 'MM-dd HH:mm')
  return formatTime(timestamp, 'yyyy-MM-dd')
}

Vue.prototype.$site = SITE

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