import Vue from 'vue'
const files = require.context('.', false, /\.js$/)

files.keys().forEach(key => {
  if (key === './index.js') return
  Vue.directive(key.replace(/(\.\/|\.js)/g, ''), files(key).default)
})
