export const IS_DEV = process.env.NODE_ENV !== 'production'
export const BASE_URL = IS_DEV ? 'http://localhost:5000/api' : 'https://wintc.top/api'
// export const BASE_URL = 'https://wintc.top/api'

export const GITHUB_CLIENT_ID = IS_DEV ? '802e5accfa4aeddf1a15' : '4634b61b9678ed2b3de6'
export const QQ_CLIENT_ID = '101843096'
