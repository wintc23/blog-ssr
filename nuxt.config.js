
export default {
  mode: 'universal',
  /*
  ** Headers of the page
  */
  head: {
    title: "木马.tc个人博客",
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: "width=device-width, initial-scale=1" },
      { name: 'keywords', content: "木马.tc,技术博客,编程,JS,HTML,CSS,Python" },
      { hid: 'description', name: 'description', content: "木马.tc个人博客" }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: "/favicon.ico" },
      { rel: "stylesheet", type: "text/css", href: "/css/prism.css" }
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
    host: '0.0.0.0',
  },
}
