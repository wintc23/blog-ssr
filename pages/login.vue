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
    login (state) {
      if (this.$isPC) {
        window.opener && window.opener._loginCallback && window.opener._loginCallback(state)
      } else {
        this.$store.dispatch('userInfo/getUserInfo', { force: true })
        let redirect = localStorage.getItem('loginRedirect') || '/'
        localStorage.clearItem()
        this.$router.replace(redirect)
      }
    },
    loginWithCode () {
      githubLogin(this.$route.query.code).then(res => {
        if (res.status == 200) {
          setToken(res.data.token)
          this.login(true)
        } else {
          this.login(false)
        }
      })
    }
  }
}
</script>
