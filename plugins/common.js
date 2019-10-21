import Vue from 'vue'

import { formatTime } from '@/tool'

Vue.prototype.$bus = new Vue()

Vue.prototype.$formatTime = formatTime

Vue.prototype.$timeShow = (timestamp) => {
  let date = new Date(timestamp * 1000)
  let now = new Date()
  let delta = now - date
  if (delta < 60) return '刚刚'
  if (delta < 60 * 60) return `${Math.floor(delta/60)}分钟前`
  if (delta < 24 * 60 * 60) return `${Math.floor(delta/60/60)}小时前`
  if (delta < 3 * 24 * 60 * 60) return `${Math.floor(delta/60/60)/24}天前`
  return formatTime(timestamp, 'yyyy-MM-dd')
}
