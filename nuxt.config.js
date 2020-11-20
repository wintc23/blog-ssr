import axios from 'axios'
import { BASE_URL } from './config'

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
      { hid: 'keywords', name: 'keywords', content: `沐码小站,编程,JS,HTML,CSS,Python,木马啊,技术博客,wintc` },
      { hid: 'description', name: 'description', content: `沐码小站，分享编程和生活。` }
    ],
    script: [
      { src: '/js/prism.js', defer: true },
      { src: 'https://hm.baidu.com/hm.js?f6c6b936d6426488699d7da96706aaad', defer: true },
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
    '@/static/css/prism.css',
    '@/static/css/common.css',
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
    Sitemap: 'https://wintc.top/sitemap.xml',
    Disallow: [
      '/manage',
      '/manage/**',
      '/qqtoken',
      '/login'
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
      '/manage/**',
      '/qqtoken',
      '/login'
    ],
    routes: function (callback) {
      axios.get('/get-sitemap-info/', { baseURL: BASE_URL }).then(res => {
        const routes = [
          '/',
          '/about',
          '/link',
          '/message'
        ]
        if (res.status == 200) {
          const { posts, tags } = res.data
          console.log(res.data, 'get-sitemap')
          const postRoutes = posts.map(id => `/article/${id}`)
          const tagRoutes = tags.map(id => `/tag/${id}`)
          routes.push(...postRoutes, ...tagRoutes)
        }
        callback(null, routes)
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
