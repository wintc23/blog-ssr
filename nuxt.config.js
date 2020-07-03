export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: `木马小站 - 分享编程与生活`,
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: "width=device-width, initial-scale=1, user-scalable=no" },
      { hid: 'keywords', name: 'keywords', content: `木马小站,编程,JS,HTML,CSS,Python` },
      { hid: 'description', name: 'description', content: `木马小站，分享编程和生活。` }
    ],
    script: [
      { src: '/js/prism.js' },
      { src: 'https://hm.baidu.com/hm.js?f6c6b936d6426488699d7da96706aaad' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: "/favicon.ico" },
      { rel: "stylesheet", type: "text/css", href: "/css/prism.css" },
      { rel: "stylesheet", type: "text/css", href: "/css/github-markdown.css" },
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: { color: '#fff' },
  /*
  ** Global CSS
  */
  css: [
    'iview/dist/styles/iview.css'
  ],
  /*
  ** Plugins to load before mounting the App
  */
  plugins: [
    '@/plugins/iview',
    '@/plugins/common'
  ],
  /*
  ** Nuxt.js dev-modules
  */
  buildModules: [
  ],
  /*
  ** Nuxt.js modules
  */
  modules: [
  ],
  /*
  ** Build configuration
  */
  build: {
    /*
    ** You can extend webpack config here
    */
    cache: true,
    parallel: true,
    extend (config, ctx) {
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0'
  },
}
