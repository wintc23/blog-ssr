import axios from 'axios'
import { BASE_URL, SITE_NAME, SITE_DESCRIPTION, SITE_KEYWORDS, SITE_SLOGON } from './config'

export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: `${SITE_NAME} - ${SITE_SLOGON}`,
    htmlAttrs: {
      lang: 'zh-CN',
    },
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: "width=device-width, initial-scale=1, user-scalable=no" },
      { hid: 'keywords', name: 'keywords', content: `${SITE_KEYWORDS}` },
      { hid: 'description', name: 'description', content: `${SITE_DESCRIPTION}` }
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
    '@/plugins/common',
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
    },
    babel: {
      plugins: [
        ["@babel/plugin-transform-private-methods", { "loose": true }],
        ["@babel/plugin-transform-private-property-in-object", { "loose": true }]
      ]
    }
  },
  server: {
    port: 8000,
    host: '0.0.0.0'
  },
}
