export const IS_DEV = process.env.NODE_ENV !== 'production'
export const BASE_URL = IS_DEV ? 'http://127.0.0.1:5000/api' : 'https://wintc.top/api'

export const GITHUB_CLIENT_ID = IS_DEV ? '802e5accfa4aeddf1a15' : '4634b61b9678ed2b3de6'
export const QQ_CLIENT_ID = '101843096'
export const ALGOLIA_APP_ID = 'RCR6JUFLKT'
export const ALGOLIA_SEARCH_KEY = '3ca6895d28d30d16b2cc895c75e403cb'
export const ALGOLIA_INDEX_NAME = IS_DEV ? 'dev_wintc' : 'prod_wintc'