<template>
  <div class="login-page">
    正在进行第三方登录，请稍候
  </div>
</template>

<script>
import { setToken } from '@/tool'

export default {
  layout: '',
  mounted () {
    let promise = this.loginWithCode()
    promise && promise.then(this.loginCallback).catch(this.loginFail)
  },
  methods: {
    login (state) {
      const data = { state, type: 'login-state' }
      Promise.resolve(() => {
        window.opener && window.opener.postMessage(data)
      }).finally(() => {
        window.close()
      })
      // if (this.$isPC) {
      //   console.log('hello2', state)
      //   console.log(window.opener, '~~~~~~')
      //   // window.opener && window.opener._loginCallback && window.opener._loginCallback(state)
      // } else {
      //   this.$store.dispatch('userInfo/getUserInfo', { force: true })
      //   let redirect = localStorage.getItem('loginRedirect') || '/'
      //   this.$router.replace(redirect)
      //   localStorage.removeItem('loginRedirect')
      // }
    },
    // 由组件实现
    loginWithCode () {},

    // 请求完成的回调
    loginCallback (res) {
      if (res.status == 200) {
        setToken(res.data.token)
        this.login(true)
      } else {
        this.login(false)
      }
    },
    loginFail () {
      this.$Message.error('登录失败，请重试')
      this.login(false)
    }
  },
}
</script>