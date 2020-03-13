<template>
  <div class="login-page">
    正在进行第三方登录，请稍候
  </div>
</template>

<script>
import { qqLogin } from '@/api/user'
import { setToken } from '@/tool'

export default {
  layout: '',
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
        this.$Message.success(redirect)
        this.$router.replace(redirect)
        localStorage.removeItem('loginRedirect')
      }
    },
    loginWithCode () {
      let { code, state } = this.$route.query
      // ??QQ要求验证，不过此处验证并非严谨
      let qqState = localStorage.getItem('qqState')
      localStorage.removeItem('qqState')
      if (qqState != state) {
        this.$Message.error('QQ登录状态异常，请重试')
        this.login(false)
        return
      }
      let redirect = encodeURI(`${window.location.origin}/qqtoken`)
      qqLogin({ code, redirect }).then(res => {
        if (res.status == 200) {
          setToken(res.data.token)
          this.$Message.success('登录成功')
          this.login(true)
        } else {
          this.login(false)
        }
      })
    }
  }
}
</script>