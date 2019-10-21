<template>
  <div class="login-page">
    正在进行第三方登录，请稍候
  </div>
</template>

<script>
import { githubLogin } from '@/api/user'

import { setToken } from '@/tool'

export default {
  layout: '',
  data () {
    return {}
  },
  mounted () {
    this.loginWithCode()
  },
  methods: {
    loginWithCode () {
      githubLogin(this.$route.query.code).then(res => {
        if (res.status == 200) {
          setToken(res.data.token)
          window.opener && window.opener._loginCallback && window.opener._loginCallback(true)
        } else {
          window.opener && window.opener._loginCallback && window.opener._loginCallback(false)
        }
      })
    }
  }
}
</script>
