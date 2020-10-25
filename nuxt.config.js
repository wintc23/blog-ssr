import axios from 'axios'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: `沐码小站 - 分享编程与生活`,
    htmlAttrs: {
      lang: 'zh-CN',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: "width=device-width, initial-scale=1, user-scalable=no" },
      { hid: 'keywords', name: 'keywords', content: `沐码小站,编程,JS,HTML,CSS,Python` },
      { hid: 'description', name: 'description', content: `沐码小站，分享编程和生活。` }
    ],
    script: [
      { src: '/js/prism.js', defer: true },
      { src: 'https://hm.baidu.com/hm.js?f6c6b936d6426488699d7da96706aaad', defer: true },
      // { src: '/js/drift.js', defer: true }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: "/favicon.ico" }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: '@/components/Loading.vue',
  /*
  ** Global CSS
  */
  css: [
    'iview/dist/styles/iview.css',
    '@/static/css/github-markdown.css',
    '@/static/css/prism.css'
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
    '@nuxtjs/sitemap',
    '@nuxtjs/robots',
  ],
  robots: {
    UserAgent: '*',
    Disallow: [
      '/manage',
      '/manage/**'
    ]
  },
  sitemap: {
    hostname: 'https://wintc.top',
    gzip: true,
    defaults: {
      changefreq: 'daily',
      priority: 1,
      lastmod: new Date()
    },
    exclude: [
      '/manage',
      '/manage/**'
    ],
    routes: function () {
      const routes = []
      return axios.get('https://wintc.top/api/get-visible-posts/').then(res => {
        if (res.status == 200) {
          const { list } = res.data
          const postRoutes = list.map(id => `/article/${id}`)
          routes.push(...postRoutes)
        }
        return routes
      })
    }
  },

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
