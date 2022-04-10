export const IS_DEV = process.env.NODE_ENV !== 'production'
export const BASE_URL = IS_DEV ? 'http://127.0.0.1:5000/api' : 'https://wintc.top/api'

export const GITHUB_CLIENT_ID = IS_DEV ? '802e5accfa4aeddf1a15' : '4634b61b9678ed2b3de6'
export const QQ_CLIENT_ID = '101843096'
export const ALGOLIA_APP_ID = 'RCR6JUFLKT'
export const ALGOLIA_SEARCH_KEY = '3ca6895d28d30d16b2cc895c75e403cb'
export const ALGOLIA_INDEX_NAME = IS_DEV ? 'dev_wintc' : 'prod_wintc'
export const SITE_NAME = '沐码小站'
export const SITE_SLOGON = '分享编程与生活'
export const SITE_KEYWORDS = '沐码小站,编程,JS,HTML,CSS,Python,技术博客,wintc,牛书书,木马啊'
export const SITE_DESCRIPTION = `${SITE_NAME}，${SITE_SLOGON}。`
export const SITE = {
  title: SITE_NAME,
  slogon: SITE_SLOGON,
  icon: 'https://file.wintc.top/logo.jpeg',
  url: 'https://wintc.top',
  keywords: SITE_KEYWORDS,
  description: SITE_KEYWORDS,
  copyright: 'Copyright © 2019-2022 lushg',
  githubHomePage: 'https://github.com/wintc23',
  location: '深圳',
}

export const RECOMMENDATION_TITLE = '书书推荐'