
function getCookie (cookie, key) {
  if (!cookie) return ''
  let cookieList = cookie.split('; ')
  let keyInfo = cookieList.reduce((info, cookieItem) => {
    let [key, value] = cookieItem.split('=')
    info[key] = value
    return info
  }, {})
  return keyInfo[key] || ''
}

export function getToken () {
  const cookies = process.server ? process.cookie : document.cookie
  return getCookie(cookies, 'token')
}

export function setToken (token) {
  let date = new Date()
  date.setHours(date.getHours() + 24 * 30)
  document.cookie = `token=${token};expires=${date.toGMTString()}`
}

export function clearToken () {
  let date = new Date()
  date.setSeconds(date.getSeconds() - 1)
  document.cookie = `token='';expires=${date.toGMTString()}`
}

export function formatTime (timestamp, format = 'yyyy-MM-dd HH:mm') {
  const formatNum = num => {
    return String(num).padStart(2, '0')
  }
  let now = new Date()
  timestamp = timestamp - now.getTimezoneOffset() * 60
  const date = new Date(timestamp * 1000)
  return format.replace(/yyyy/g, date.getFullYear())
    .replace(/MM/g, formatNum(date.getMonth() + 1))
    .replace(/dd/g, formatNum(date.getDate()))
    .replace(/HH/g, formatNum(date.getHours()))
    .replace(/mm/g, formatNum(date.getMinutes()))
    .replace(/ss/g, formatNum(date.getSeconds()))
    .replace(/SSS/g, formatNum(date.getMilliseconds()))
}

export function camel (data) {
  if (!data || typeof data === 'string') return data
  if (Array.isArray(data)) {
    return data.map(item => camel(item))
  }
  if (typeof data === 'object') {
    let newData = {}
    for (let key in data) {
      let newKey = key.replace(/_([a-z])/g, (_, $1) => $1.toUpperCase())
      newData[newKey] = camel(data[key])
    }
    return newData
  }
  return data
}

export function underline (data) {
  if (!data || typeof data === 'string') return data
  if (typeof data === 'string') {
    return data.replace(/([A-Z])/g, (_, $1) => `_${$1.toLowerCase()}`)
  }
  if (Array.isArray(data)) {
    return data.map(item => underline(item))
  }
  if (typeof data === 'object') {
    let newData = {}
    for (let key in data) {
      let newKey = key.replace(/([A-Z])/g, (_, $1) => `_${$1.toLowerCase()}`)
      newData[newKey] = underline(data[key])
    }
    return newData
  }
  return data
}

export const SITE = {
  title: '沐码小站',
  slogon: '分享编程与生活',
  keywords: '沐码小站,编程,JS,HTML,CSS,Python',
  description: '沐码小站，分享编程和生活。'
}

export function* fibonacci (n) {
  let a = 1, b = 1
  for (let i = 0; i < n; i++) {
    [a, b] = [b, a + b]
    yield a
  }
}

export const TAG_LIST = [
  'orange',
  'geekblue',
  'cyan',
  'green',
  'purple',
  'magenta',
  'blue',
  'volcano'
]

export function singleClick (func, manuDone = false) {
  let lock = false
  return function (...args) {
    if (lock) return
    lock = true
    let done = () => lock = false
    if (manuDone) return func.call(this, ...args, done)
    let promise = func.call(this, ...args)
    promise ? promise.finally(done) : done()
    return promise
  }
}